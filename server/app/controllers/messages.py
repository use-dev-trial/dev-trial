import logging

from fastapi import APIRouter

from app.models.messages import MessageRequest, MessageResponse
from app.services.messages import MessagesService

log = logging.getLogger(__name__)


class MessagesController:
    def __init__(self, service: MessagesService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.post(
            "",
            response_model=MessageResponse,
        )
        async def chat(
            input: MessageRequest,
        ) -> MessageResponse:
            log.info("Sending message to assistant...")
            response: MessageResponse = await self.service.chat(content=input.content)
            log.info("Message to be sent back to user: %s", response.content)
            return response
