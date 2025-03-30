import logging

from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient as Client

from app.models.problem import UpsertProblemRequest, UpsertProblemResponse
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
            response_model=UpsertProblemResponse,
        )
        async def upsert_problem(
            input: UpsertProblemRequest, client: Client = Depends(init_db_client)
        ) -> UpsertProblemResponse:
            log.info("Upserting problem: %s", input.title)
            response: UpsertProblemResponse = await self.service.upsert_problem(
                input=input, client=client
            )
            log.info("Upserted problem: %s", response.title)
            return response
