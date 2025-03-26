from app.models.messages import MessageResponse


class MessagesService:
    async def chat(self, content: str) -> MessageResponse:
        return MessageResponse(content=content)
