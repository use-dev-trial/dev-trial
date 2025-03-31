import asyncio
import logging
from typing import Optional

from agents import RunConfig, Runner, RunResult, TResponseInputItem
from supabase._async.client import AsyncClient as Client

from app.inference.agents import triager
from app.inference.constants import AgentNames
from app.inference.state import AgentState
from app.models.database import Table
from app.models.file import File
from app.models.message import MessageRequest, MessageResponse, Role
from app.models.problem import Problem
from app.models.question import Question
from app.models.test_case import TestCase
from app.utils.database import is_valid_uuid

log = logging.getLogger(__name__)


MAX_TURNS = 3
MAX_TURNS_DEFAULT_MESSAGE = "How does this look to you?"


class MessagesService:
    async def chat(self, input: MessageRequest, client: Client) -> MessageResponse:
        existing_messages: list[TResponseInputItem] = (
            []
            if not input.id
            else await _retrieve_existing_messages(client=client, message_id=input.id)
        )

        # Add user message to existing messages
        existing_messages.append({"role": Role.USER.value, "content": input.content})

        if input.question_id is None:
            db_result = await client.table(Table.QUESTIONS).insert({}).execute()
            question = Question(
                id=db_result.data[0]["id"],
                problem=Problem(
                    id="", title="", description="", requirements=[]
                ),  # default values are not permitted in the agent system
                files=[],
                test_cases=[],
            )
        else:
            question = await retrieve_existing_question(
                client=client, question_id=input.question_id
            )

        num_turns = 0
        exit = False
        while not exit:
            num_turns += 1
            if num_turns > MAX_TURNS:
                log.error(f"Max turns ({MAX_TURNS}) exceeded. Exiting agent system...")
                result.final_output = MAX_TURNS_DEFAULT_MESSAGE
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
                    if not question.problem.id:
                        problem: Problem = await _insert_problem(
                            client=client, result=result, question_id=question.id
                        )
                    else:
                        problem: Problem = await _update_problem(
                            client=client, result=result, problem_id=question.problem.id
                        )
                    question.problem = problem
                    existing_messages.append(
                        {
                            "role": Role.ASSISTANT.value,
                            "content": f"Here is the revised problem description:\n{problem.model_dump_json(indent=2)}",
                        }
                    )
                case AgentNames.FILE_GENERATOR:
                    if not question.files:
                        files: list[File] = await _insert_files(
                            client=client, result=result, question_id=question.id
                        )
                    else:
                        files: list[File] = await _update_files(
                            client=client,
                            result=result,
                            original_files=question.files,
                            question_id=question.id,
                        )
                    question.files = files
                    existing_messages.append(
                        {
                            "role": Role.ASSISTANT.value,
                            "content": f"Here is the revised set of files:\n{[file.model_dump_json(indent=2) for file in files]}",
                        }
                    )
                case AgentNames.TEST_GENERATOR:
                    if not question.test_cases:
                        test_cases: list[TestCase] = await _insert_test_cases(
                            client=client, result=result, question_id=question.id
                        )
                    else:
                        test_cases: list[TestCase] = await _update_test_cases(
                            client=client,
                            result=result,
                            original_test_cases=question.test_cases,
                            question_id=question.id,
                        )
                    question.test_cases = test_cases
                    existing_messages.append(
                        {
                            "role": Role.ASSISTANT.value,
                            "content": f"Here is the revised set of test cases:\n{[test_case.model_dump_json(indent=2) for test_case in test_cases]}",
                        }
                    )
                case AgentNames.TRIAGER:
                    log.info("Triager did not initiate a handoff. Terminating agent system...")
                    exit = True

            log.info(f"Turn {num_turns}: {result.final_output}")

        # Add assistant response to existing messages
        existing_messages.append({"role": Role.ASSISTANT.value, "content": result.final_output})

        response_id: Optional[str] = None

        if not input.id:
            # Create a new entry in the messages table
            db_result = (
                await client.table(Table.MESSAGES)
                .insert([{"messages": existing_messages}])
                .execute()
            )
        else:
            # Update existing entry in the messages table
            db_result = (
                await client.table(Table.MESSAGES)
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


async def _insert_files(client: Client, result: RunResult, question_id: str) -> list[File]:
    """
    Inserts the newly generated files into the Files table.
    Inserts the corresponding entry in the question_file join table to keep track of the relation.
    """
    files: list[File] = []
    for file in result.final_output:
        insert_file_result = (
            await client.table(Table.FILES)
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
        await client.table(Table.QUESTION_FILE).insert(
            {
                "question_id": question_id,
                "file_id": file_id,
            }
        ).execute()

    return files


async def _update_files(
    client: Client, result: RunResult, original_files: list[File], question_id: str
) -> list[File]:
    """
    Updates the files table with the most recently generated files.
    """
    updated_files: dict[str, File] = {}
    for file in result.final_output:
        if is_valid_uuid(file.id):
            # LLM updates an existing test case
            await client.table(Table.FILES).update(
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
                await client.table(Table.FILES)
                .insert(
                    {
                        "name": file.name,
                        "code": file.code,
                    }
                )
                .execute()
            )
            await client.table(Table.QUESTION_FILE).insert(
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


async def _insert_test_cases(client: Client, result: RunResult, question_id: str) -> list[TestCase]:
    """
    Inserts the newly generated test cases into the test_case table.
    Inserts the corresponding entry in the question_test_case join table to keep track of the relation.
    """
    test_cases: list[TestCase] = []
    for test_case in result.final_output:
        insert_test_case_result = (
            await client.table(Table.TEST_CASES)
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
        await client.table(Table.QUESTION_TEST_CASE).insert(
            {
                "question_id": question_id,
                "test_case_id": test_case_id,
            }
        ).execute()

    return test_cases


async def _update_test_cases(
    client: Client,
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
            await client.table(Table.TEST_CASES).update(
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
                await client.table(Table.TEST_CASES)
                .insert(
                    {
                        "description": test_case.description,
                    }
                )
                .execute()
            )
            await client.table(Table.QUESTION_TEST_CASE).insert(
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


async def _insert_problem(client: Client, result: RunResult, question_id: str) -> Problem:
    """
    Inserts the newly generated problem into the Problems table.
    Updates the problem_id foreign key in the Questions table.
    """
    insert_problem_result = (
        await client.table(Table.PROBLEMS)
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
    await client.table(Table.QUESTIONS).update({"problem_id": problem_id}).eq(
        "id", question_id
    ).execute()
    return Problem(
        id=problem_id,
        title=result.final_output.title,
        description=result.final_output.description,
        requirements=result.final_output.requirements,
    )


async def _update_problem(client: Client, result: RunResult, problem_id: str) -> Problem:
    """
    Updates the more recently modified version of the problem in the Problems table.
    """
    await client.table(Table.PROBLEMS).update(
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


async def retrieve_existing_question(client: Client, question_id: str) -> Question:
    problem_id_task = (
        client.table(Table.QUESTIONS).select("problem_id").eq("id", question_id).execute()
    )
    file_ids_task = (
        client.table(Table.QUESTION_FILE).select("file_id").eq("question_id", question_id).execute()
    )
    test_case_ids_task = (
        client.table(Table.QUESTION_TEST_CASE)
        .select("test_case_id")
        .eq("question_id", question_id)
        .execute()
    )

    problem_id_result, file_ids_result, test_case_ids_result = await asyncio.gather(
        problem_id_task, file_ids_task, test_case_ids_task
    )

    problem_id_task = asyncio.to_thread(
        lambda: problem_id_result.data[0]["problem_id"] if problem_id_result.data else None
    )
    file_ids_task = asyncio.to_thread(
        lambda: [row["file_id"] for row in file_ids_result.data] if file_ids_result.data else []
    )
    test_case_ids_task = asyncio.to_thread(
        lambda: (
            [row["test_case_id"] for row in test_case_ids_result.data]
            if test_case_ids_result.data
            else []
        )
    )

    problem_id, file_ids, test_case_ids = await asyncio.gather(
        problem_id_task, file_ids_task, test_case_ids_task
    )

    problem_task = (
        client.table(Table.PROBLEMS).select("*").eq("id", problem_id).execute()
        if problem_id
        else asyncio.sleep(0)
    )

    file_task = (
        client.table(Table.FILES).select("*").in_("id", file_ids).execute()
        if file_ids
        else asyncio.sleep(0)
    )

    test_case_task = (
        client.table(Table.TEST_CASES).select("*").in_("id", test_case_ids).execute()
        if test_case_ids
        else asyncio.sleep(0)
    )

    problem_result, file_results, test_case_results = await asyncio.gather(
        problem_task, file_task, test_case_task
    )

    # Parse results in parallel
    problem_task = asyncio.to_thread(
        lambda: (
            Problem.model_validate(problem_result.data[0])
            if problem_result and problem_result.data
            else None
        )
    )

    files_task = asyncio.to_thread(
        lambda: (
            [File.model_validate(row) for row in file_results.data]
            if file_results and file_results.data
            else []
        )
    )

    test_cases_task = asyncio.to_thread(
        lambda: (
            [TestCase.model_validate(row) for row in test_case_results.data]
            if test_case_results and test_case_results.data
            else []
        )
    )

    problem, files, test_cases = await asyncio.gather(problem_task, files_task, test_cases_task)

    return Question(id=question_id, problem=problem, files=files, test_cases=test_cases)


async def _retrieve_existing_messages(client: Client, message_id: str) -> list[TResponseInputItem]:
    result = await client.table(Table.MESSAGES).select("messages").eq("id", message_id).execute()
    if not result.data:
        raise ValueError(f"Chat with id '{message_id}' not found.")
    existing_messages = result.data[0]["messages"]
    return existing_messages
