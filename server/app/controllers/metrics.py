import logging

from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient as Client

from app.models.metric import UpsertMetricRequest, UpsertMetricResponse
from app.services.metrics import MetricsService
from app.utils.dependencies import init_db_client

log = logging.getLogger(__name__)


class MetricsController:
    def __init__(self, service: MetricsService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.post(
            "",
            response_model=UpsertMetricResponse,
        )
        async def upsert_metric(
            input: UpsertMetricRequest, client: Client = Depends(init_db_client)
        ) -> UpsertMetricResponse:
            log.info("Upserting metric: %s", input.id)
            response: UpsertMetricResponse = await self.service.upsert_metric(
                input=input, client=client
            )
            log.info("Upserted problem: %s", response.id)
            return response

        @router.delete(
            "/{id}",
        )
        async def delete_metric(id: str, client: Client = Depends(init_db_client)):
            log.info("Deleting metric: %s", id)
            await self.service.delete_metric(id=id, client=client)
            log.info("Deleted metric: %s", id)
