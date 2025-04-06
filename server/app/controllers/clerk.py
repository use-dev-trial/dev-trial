import logging

from fastapi import (
    APIRouter,
)

from app.services.clerk import ClerkService

log = logging.getLogger(__name__)


class ClerkController:
    def __init__(self, service: ClerkService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router
