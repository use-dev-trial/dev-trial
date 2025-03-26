from typing import Optional

from app.models.database import Table
from app.models.messages import Message, MessageRequest, MessageResponse, Role
from app.utils.database import DatabaseManager


class MessagesService:
    async def chat(self, input: MessageRequest) -> MessageResponse:
        db_manager = await DatabaseManager.get_instance()

        # TODO: Invoke LLM
        dummy_response: str = "I've processed your message: \"" + input.content + '"'
        new_messages: list[Message] = [
            Message(role=Role.USER, content=input.content),
            Message(role=Role.ASSISTANT, content=dummy_response),
        ]

        response_id: Optional[str] = None

        if input.id is None:
            # Create a new chat history
            result = (
                await db_manager.client.table(Table.MESSAGES)
                .insert([{Table.MESSAGES: [msg.model_dump() for msg in new_messages]}])
                .execute()
            )
        else:
            # Append to existing chat history
            existing_chat = (
                await db_manager.client.table(Table.MESSAGES)
                .select(Table.MESSAGES)
                .eq("id", input.id)
                .execute()
            )

            if not existing_chat.data:
                raise ValueError(f"Chat with id '{input.id}' not found.")

            existing_messages: list[dict] = existing_chat.data[0][Table.MESSAGES]
            existing_messages.extend([msg.model_dump() for msg in new_messages])

            result = (
                await db_manager.client.table(Table.MESSAGES)
                .update({Table.MESSAGES: existing_messages})
                .eq("id", input.id)
                .execute()
            )
        if result.data and result.data[0] and "id" in result.data[0]:
            response_id = result.data[0]["id"]
        else:
            raise Exception("Failed to retrieve ID after inserting messages.")

        return MessageResponse.model_validate({"id": response_id, "content": dummy_response})
