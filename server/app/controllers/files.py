import logging

from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient as Client

from app.models.file import UpsertFileRequest, UpsertFileResponse
from app.services.files import FilesService
from app.utils.dependencies import init_db_client

log = logging.getLogger(__name__)


class FilesController:
    def __init__(self, service: FilesService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.post(
            "",
            response_model=UpsertFileResponse,
        )
        async def upsert_file(
            input: UpsertFileRequest, client: Client = Depends(init_db_client)
        ) -> UpsertFileResponse:
            log.info("Upserting file: %s", input.id)
            response: UpsertFileResponse = await self.service.upsert_file(
                input=input, client=client
            )
            log.info("Upserted file: %s", response.id)
            return response
