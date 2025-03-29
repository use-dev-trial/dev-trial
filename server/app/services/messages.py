import logging
from typing import Optional

from agents import RunConfig, Runner, RunResult, TResponseInputItem, trace

from app.inference.agents import triager
from app.inference.constants import AgentNames
from app.inference.state import AgentState
from app.models.database import Table
from app.models.file import File
from app.models.message import MessageRequest, MessageResponse, Role
from app.models.problem import Problem
from app.models.question import Question
from app.models.test_case import TestCase
from app.utils.database import DatabaseManager, is_valid_uuid

log = logging.getLogger(__name__)

# TODO: Add reasoning to the triager's handoff in the ctx

MAX_TURNS = 3


class MessagesService:
    async def chat(self, input: MessageRequest) -> MessageResponse:
        db_manager = await DatabaseManager.get_instance()
        existing_messages: list[TResponseInputItem] = (
            []
            if input.id is None
            else await _retrieve_existing_messages(db_manager=db_manager, message_id=input.id)
        )

        # Add user message to existing messages
        existing_messages.append({"role": Role.USER.value, "content": input.content})

        if input.question_id is None:
            db_result = await db_manager.client.table(Table.QUESTIONS).insert({}).execute()
            question = Question(id=db_result.data[0]["id"])
        else:
            question = await _retrieve_existing_question(
                db_manager=db_manager, question_id=input.question_id
            )

        num_turns = 0
        exit = False
        with trace("DevTrial"):
            while not exit:
                num_turns += 1
                if num_turns > MAX_TURNS:
                    log.error(f"Max turns ({MAX_TURNS}) exceeded. Exiting agent system...")
                    break
                result: RunResult = await Runner.run(
                    starting_agent=triager,
                    input=existing_messages,
                    context=AgentState(question=question),
                    run_config=RunConfig(
                        tracing_disabled=False,
                    ),
                )
                match result.last_agent.name:
                    case AgentNames.PROBLEM_GENERATOR:
                        if not question.problem:
                            problem: Problem = await _insert_problem(
                                db_manager=db_manager, result=result, question_id=question.id
                            )
                        else:
                            problem: Problem = await _update_problem(
                                db_manager=db_manager, result=result, problem_id=question.problem.id
                            )
                        question.problem = problem
                    case AgentNames.FILE_GENERATOR:
                        if not question.files:
                            files: list[File] = await _insert_files(
                                db_manager=db_manager, result=result, question_id=question.id
                            )

                        else:
                            files: list[File] = await _update_files(
                                db_manager=db_manager,
                                result=result,
                                original_files=question.files,
                                question_id=question.id,
                            )
                        question.files = files
                    case AgentNames.TEST_GENERATOR:
                        if not question.test_cases:
                            test_cases: list[TestCase] = await _insert_test_cases(
                                db_manager=db_manager, result=result, question_id=question.id
                            )
                        else:
                            test_cases: list[TestCase] = await _update_test_cases(
                                db_manager=db_manager,
                                result=result,
                                original_test_cases=question.test_cases,
                                question_id=question.id,
                            )
                        question.test_cases = test_cases
                    case AgentNames.TRIAGER:
                        log.info("Triager did not initiate a handoff. Terminating agent system...")
                        exit = True
                log.info(f"Turn {num_turns}: {result.final_output}")

        # Add assistant response to existing messages
        existing_messages.append({"role": Role.ASSISTANT.value, "content": result.final_output})

        response_id: Optional[str] = None

        if input.id is None:
            # Create a new entry in the messages table
            db_result = (
                await db_manager.client.table(Table.MESSAGES)
                .insert([{"messages": existing_messages}])
                .execute()
            )
        else:
            # Update existing entry in the messages table
            db_result = (
                await db_manager.client.table(Table.MESSAGES)
                .update({"messages": existing_messages})
                .eq("id", input.id)
                .execute()
            )

        # Extracts the id from the result of the database operation
        if db_result.data and db_result.data[0] and "id" in db_result.data[0]:
            response_id = db_result.data[0]["id"]
            if not response_id:
                raise Exception("ID of entry in messages table cannot be None.")
        else:
            raise Exception("Failed to retrieve ID after inserting messages.")

        return MessageResponse(
            id=response_id,
            content=result.final_output,
            question=question,
        )


async def _insert_files(
    db_manager: DatabaseManager, result: RunResult, question_id: str
) -> list[File]:
    """
    Inserts the newly generated files into the Files table.
    Inserts the corresponding entry in the question_file join table to keep track of the relation.
    """
    files: list[File] = []
    for file in result.final_output:
        insert_file_result = (
            await db_manager.client.table(Table.FILES)
            .insert(
                {
                    "name": file.name,
                    "code": file.code,
                }
            )
            .execute()
        )
        file_id: str = insert_file_result.data[0]["id"]
        files.append(
            File(
                id=file_id,
                name=file.name,
                code=file.code,
            )
        )
        await db_manager.client.table(Table.QUESTION_FILE).insert(
            {
                "question_id": question_id,
                "file_id": file_id,
            }
        ).execute()

    return files


async def _update_files(
    db_manager: DatabaseManager, result: RunResult, original_files: list[File], question_id: str
) -> list[File]:
    """
    Updates the files table with the most recently generated files.
    """
    updated_files: dict[str, File] = {}
    for file in result.final_output:
        if is_valid_uuid(file.id):
            # LLM updates an existing test case
            await db_manager.client.table(Table.FILES).update(
                {
                    "name": file.name,
                    "code": file.code,
                }
            ).eq("id", file.id).execute()
            updated_files[file.id] = File(
                id=file.id,
                name=file.name,
                code=file.code,
            )
        else:
            # LLM either creates a new file of hallucinates id of an existing file. For now, we will just create a new file
            insert_file_result = (
                await db_manager.client.table(Table.FILES)
                .insert(
                    {
                        "name": file.name,
                        "code": file.code,
                    }
                )
                .execute()
            )
            await db_manager.client.table(Table.QUESTION_FILE).insert(
                {
                    "question_id": question_id,
                    "file_id": insert_file_result.data[0]["id"],
                }
            ).execute()
            updated_files[file.id] = File(
                id=file.id,
                name=file.name,
                code=file.code,
            )

    final_files: list[File] = []
    for file in original_files:
        if file.id in updated_files:
            # Use the updated file where relevant
            final_files.append(updated_files[file.id])
        else:
            # Use the original file if LLM did not update it
            final_files.append(file)

    return final_files


async def _insert_test_cases(
    db_manager: DatabaseManager, result: RunResult, question_id: str
) -> list[TestCase]:
    """
    Inserts the newly generated test cases into the test_case table.
    Inserts the corresponding entry in the question_test_case join table to keep track of the relation.
    """
    test_cases: list[TestCase] = []
    for test_case in result.final_output:
        insert_test_case_result = (
            await db_manager.client.table(Table.TEST_CASES)
            .insert(
                {
                    "description": test_case.description,
                }
            )
            .execute()
        )
        test_case_id: str = insert_test_case_result.data[0]["id"]
        test_cases.append(
            TestCase(
                id=test_case_id,
                description=test_case.description,
            )
        )
        await db_manager.client.table(Table.QUESTION_TEST_CASE).insert(
            {
                "question_id": question_id,
                "test_case_id": test_case_id,
            }
        ).execute()

    return test_cases


async def _update_test_cases(
    db_manager: DatabaseManager,
    result: RunResult,
    original_test_cases: list[TestCase],
    question_id: str,
) -> list[TestCase]:
    """
    Updates the test_case table with the most recently generated test cases.
    """
    updated_test_cases: dict[str, TestCase] = {}
    for test_case in result.final_output:
        if is_valid_uuid(test_case.id):
            # LLM updates an existing test case
            await db_manager.client.table(Table.TEST_CASES).update(
                {
                    "description": test_case.description,
                }
            ).eq("id", test_case.id).execute()
            updated_test_cases[test_case.id] = TestCase(
                id=test_case.id,
                description=test_case.description,
            )
        else:
            # LLM either creates a new test case of hallucinates id of an existing test case. For now, we will just create a new test case
            insert_test_case_result = (
                await db_manager.client.table(Table.TEST_CASES)
                .insert(
                    {
                        "description": test_case.description,
                    }
                )
                .execute()
            )
            await db_manager.client.table(Table.QUESTION_TEST_CASE).insert(
                {
                    "question_id": question_id,
                    "test_case_id": insert_test_case_result.data[0]["id"],
                }
            ).execute()
            updated_test_cases[test_case.id] = TestCase(
                id=test_case.id,
                description=test_case.description,
            )

    final_test_cases: list[TestCase] = []
    for test_case in original_test_cases:
        if test_case.id in updated_test_cases:
            # Use the updated test case where relevant
            final_test_cases.append(updated_test_cases[test_case.id])
        else:
            # Use the original test case if LLM did not update it
            final_test_cases.append(test_case)

    return final_test_cases


async def _insert_problem(
    db_manager: DatabaseManager, result: RunResult, question_id: str
) -> Problem:
    """
    Inserts the newly generated problem into the Problems table.
    Updates the problem_id foreign key in the Questions table.
    """
    insert_problem_result = (
        await db_manager.client.table(Table.PROBLEMS)
        .insert(
            {
                "title": result.final_output.title,
                "description": result.final_output.description,
                "requirements": result.final_output.requirements,
            }
        )
        .execute()
    )
    problem_id: str = insert_problem_result.data[0]["id"]
    await db_manager.client.table(Table.QUESTIONS).update({"problem_id": problem_id}).eq(
        "id", question_id
    ).execute()
    return Problem(
        id=problem_id,
        title=result.final_output.title,
        description=result.final_output.description,
        requirements=result.final_output.requirements,
    )


async def _update_problem(
    db_manager: DatabaseManager, result: RunResult, problem_id: str
) -> Problem:
    """
    Updates the more recently modified version of the problem in the Problems table.
    """
    await db_manager.client.table(Table.PROBLEMS).update(
        {
            "title": result.final_output.title,
            "description": result.final_output.description,
            "requirements": result.final_output.requirements,
        }
    ).eq("id", problem_id).execute()
    return Problem(
        id=problem_id,
        title=result.final_output.title,
        description=result.final_output.description,
        requirements=result.final_output.requirements,
    )


async def _retrieve_existing_question(db_manager: DatabaseManager, question_id: str) -> Question:
    # TODO: Make these DB operations run in parallel
    problem_id_result = (
        await db_manager.client.table(Table.QUESTIONS)
        .select("problem_id")
        .eq("id", question_id)
        .execute()
    )
    file_ids_result = (
        await db_manager.client.table(Table.QUESTION_FILE)
        .select("file_id")
        .eq("question_id", question_id)
        .execute()
    )
    test_case_ids_result = (
        await db_manager.client.table(Table.QUESTION_TEST_CASE)
        .select("test_case_id")
        .eq("question_id", question_id)
        .execute()
    )

    problem_id: Optional[str] = problem_id_result.data[0]["problem_id"]
    file_ids: list[str] = [
        file_id_result.data[0]["file_id"] for file_id_result in file_ids_result.data
    ]
    test_case_ids: list[str] = [
        test_case_ids_result.data[0]["test_case_id"]
        for test_case_ids_result in test_case_ids_result.data
    ]

    problem_result = (
        await db_manager.client.table(Table.PROBLEMS)
        .select("problems")
        .eq("id", problem_id)
        .execute()
    )
    problem: Optional[Problem] = (
        None
        if not problem_result.data
        else Problem.model_validate(problem_result.data[0]["problems"])
    )

    file_results = (
        await db_manager.client.table(Table.FILES).select("files").in_("id", file_ids).execute()
    )
    files: Optional[list[File]] = (
        None
        if not file_results.data
        else [File.model_validate(file_result["files"]) for file_result in file_results.data]
    )

    test_case_results = (
        await db_manager.client.table(Table.TEST_CASES)
        .select("test_cases")
        .in_("id", test_case_ids)
        .execute()
    )
    test_cases: Optional[list[TestCase]] = (
        None
        if not test_case_results.data
        else [
            TestCase.model_validate(test_case_result["test_cases"])
            for test_case_result in file_results.data
        ]
    )

    return Question(id=question_id, problem=problem, files=files, test_cases=test_cases)


async def _retrieve_existing_messages(
    db_manager: DatabaseManager, message_id: str
) -> list[TResponseInputItem]:
    result = (
        await db_manager.client.table(Table.MESSAGES)
        .select("messages")
        .eq("id", message_id)
        .execute()
    )
    if not result.data:
        raise ValueError(f"Chat with id '{message_id}' not found.")
    # TODO: Check whether theres polluting metadata like datetime. If yes, drop them.
    existing_messages = result.data[0]["messages"]
    return existing_messages
