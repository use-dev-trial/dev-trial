import logging

from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient as Client

from app.models.question import Question, RunTestsRequest
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
            "",
            response_model=list[Question],
        )
        async def get_all_questions(client: Client = Depends(init_db_client)) -> list[Question]:
            log.info("Getting all questions...")
            response: list[Question] = await self.service.get_all_questions(client=client)
            log.info("Questions: %s", response)
            return response

        @router.get(
            "/question_id/{question_id}",
            response_model=Question,
        )
        async def get_question_by_id(
            question_id: str, client: Client = Depends(init_db_client)
        ) -> Question:
            log.info(f"Getting question with id {question_id}...")
            response: Question = await self.service.get_question_by_id(
                question_id=question_id, client=client
            )
            log.info("Question: %s", response)
            return response

        @router.get(
            "/challenge_id/{challenge_id}",
            response_model=list[Question],
        )
        async def get_questions_by_challenge_id(
            challenge_id: str, client: Client = Depends(init_db_client)
        ) -> list[Question]:
            log.info(f"Getting all questions associated with challenge id {challenge_id}...")
            response: list[Question] = await self.service.get_questions_by_challenge_id(
                challenge_id=challenge_id, client=client
            )
            log.info("Questions: %s", response)
            return response

        @router.post(
            "/run-tests/{question_id}",
        )
        async def run_tests(
            question_id: str,
            run_tests_request: RunTestsRequest,
            client: Client = Depends(init_db_client),
        ) -> str:
            log.info(f"Running tests for question {question_id}...")
            result: str = await self.service.run_tests(
                question_id=question_id, code=run_tests_request.code, client=client
            )
            log.info("Tests run successfully")
            return result
