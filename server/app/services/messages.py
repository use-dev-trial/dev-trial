from app.models.messages import MessagesResponse


class MessagesService:
    async def chat(self, content: str) -> MessagesResponse:
        return MessagesResponse(content=content)
