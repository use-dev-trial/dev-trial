from app.models.messages import MessageResponse
from app.utils.database import DatabaseManager


class MessagesService:
    async def chat(self, content: str) -> MessageResponse:
        db_manager = await DatabaseManager.get_instance()
        await db_manager.client.table("messages").insert(
            {
                "messages": [
                    {"role": "user", "content": content},
                    {"role": "assistant", "content": "Hello, how can I help you?"},
                ]
            }
        ).execute()

        return MessageResponse(content=content)
