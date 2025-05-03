import logging

from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient as Client

from app.models.problem import Problem
from app.services.problems import ProblemsService
from app.utils.dependencies import init_db_client

log = logging.getLogger(__name__)


class ProblemsController:
    def __init__(self, service: ProblemsService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.post(
            "",
            response_model=Problem,
        )
        async def upsert_problem(
            input: Problem, client: Client = Depends(init_db_client)
        ) -> Problem:
            log.info("Upserting problem...")
            response: Problem = await self.service.upsert_problem(input=input, client=client)
            log.info("Upserted problem: %s", response.id)
            return response

        @router.get(
            "/{problem_id}",
            response_model=Problem,
        )
        async def get_problem(problem_id: str, client: Client = Depends(init_db_client)) -> Problem:
            log.info("Getting problem: %s", problem_id)
            response: Problem = await self.service.get_problem(problem_id=problem_id, client=client)
            log.info("Retrieved problem: %s", response.title)
            return response
