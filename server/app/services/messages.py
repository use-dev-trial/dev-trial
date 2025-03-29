import logging
from typing import Optional

from agents import Runner, RunResult, TResponseInputItem

from app.inference.agents import triager
from app.inference.constants import AgentNames
from app.inference.state import AgentState
from app.models.database import Table
from app.models.message import MessageRequest, MessageResponse, Role
from app.models.question import Question
from app.utils.database import DatabaseManager

log = logging.getLogger(__name__)
from agents import Runner


class MessagesService:
    async def chat(self, input: MessageRequest) -> MessageResponse:
        db_manager = await DatabaseManager.get_instance()
        existing_messages: list[TResponseInputItem] = []
        if input.id is not None:
            # Retrieve prior messages from DB
            existing_chat = (
                await db_manager.client.table(Table.MESSAGES)
                .select(Table.MESSAGES)
                .eq("id", input.id)
                .execute()
            )
            if not existing_chat.data:
                raise ValueError(f"Chat with id '{input.id}' not found.")
            existing_messages = existing_chat.data[0][Table.MESSAGES]

        # Add user message to existing messages
        existing_messages.append({"role": Role.USER.value, "content": input.content})

        # TODO: Retrieve half-completed question object from DB
        question = Question()
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
                .insert([{Table.MESSAGES: existing_messages}])
                .execute()
            )
        else:
            # Update existing entry in the messages table
            db_result = (
                await db_manager.client.table(Table.MESSAGES)
                .update({Table.MESSAGES: existing_messages})
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
