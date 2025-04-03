import logging

from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient as Client

from app.models.question import (
    Question,
)
from app.services.questions import QuestionsService
from app.utils.dependencies import init_db_client

log = logging.getLogger(__name__)


class QuestionsController:
    def __init__(self, service: QuestionsService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.get(
            "/{question_id}",
            response_model=Question,
        )
        async def get_question(
            question_id: str, client: Client = Depends(init_db_client)
        ) -> Question:
            log.info(f"Getting question with id {question_id}...")
            response: Question = await self.service.get_question(
                question_id=question_id, client=client
            )
            log.info("Question: %s", response)
            return response
