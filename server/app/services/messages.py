import logging
from typing import Optional

from agents import Runner, RunResult, TResponseInputItem

from app.inference.agents import triager
from app.inference.constants import AgentNames
from app.inference.state import AgentState
from app.models.database import Table
from app.models.file import File
from app.models.message import MessageRequest, MessageResponse, Role
from app.models.problem import Problem
from app.models.question import Files, Question, TestCases
from app.models.test_case import TestCase
from app.utils.database import DatabaseManager

log = logging.getLogger(__name__)
from agents import Runner


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

        # TODO: Retrieve half-completed question object from DB
        exit = False
        while not exit:
            result: RunResult = await Runner.run(
                starting_agent=triager,
                input=existing_messages,
                context=AgentState(question=question),
            )
            match result.last_agent.name:
                case AgentNames.PROBLEM_GENERATOR:
                    question.problem = result.final_output
                case AgentNames.FILE_GENERATOR:
                    question.files = result.final_output
                case AgentNames.TEST_GENERATOR:
                    question.test_cases = result.final_output
                case AgentNames.TRIAGER:
                    log.info("Triager did not initiate a handoff. Terminating agent system...")
                    exit = True

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
    files: Optional[Files] = (
        None
        if not file_results.data
        else Files(
            files=[File.model_validate(file_result["files"]) for file_result in file_results.data]
        )
    )

    test_case_results = (
        await db_manager.client.table(Table.TEST_CASES)
        .select("test_cases")
        .in_("id", test_case_ids)
        .execute()
    )
    test_cases: Optional[TestCases] = (
        None
        if not test_case_results.data
        else TestCases(
            test_cases=[
                TestCase.model_validate(test_case_result["test_cases"])
                for test_case_result in file_results.data
            ]
        )
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
