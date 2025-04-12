import logging

from fastapi import (
    APIRouter,
    Depends,
)
from supabase._async.client import AsyncClient as Client

from app.models.grading import Metrics
from app.services.grading import GradingService
from app.utils.dependencies import init_db_client

log = logging.getLogger(__name__)


class GradingController:
    def __init__(self, service: GradingService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.post(
            "/metrics",
        )
        async def upsert_metrics(input: Metrics, client: Client = Depends(init_db_client)):
            log.info(f"Upserting grading metrics for question {input.id}...")
            await self.service.upsert_metrics(input=input, client=client)
            log.info(f"Grading metrics for question {input.id} have been successfully created.")
