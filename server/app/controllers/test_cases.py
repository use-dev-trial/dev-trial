import logging

from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient as Client

from app.models.test_case import UpsertTestCaseRequest, UpsertTestCaseResponse
from app.services.test_cases import TestCasesService
from app.utils.dependencies import init_db_client

log = logging.getLogger(__name__)


class TestCasesController:
    def __init__(self, service: TestCasesService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.post(
            "",
            response_model=UpsertTestCaseResponse,
        )
        async def upsert_test_case(
            input: UpsertTestCaseRequest, client: Client = Depends(init_db_client)
        ) -> UpsertTestCaseResponse:
            log.info("Upserting test_case: %s", input.id)
            response: UpsertTestCaseResponse = await self.service.upsert_test_case(
                input=input, client=client
            )
            log.info("Upserted problem: %s", response.id)
            return response
