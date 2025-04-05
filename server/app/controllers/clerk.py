import logging

from fastapi import (
    APIRouter,
    Depends,
)

from app.models.clerk import (
    CreateOrganizationRequest,
    CreateOrganizationResponse,
)
from app.services.clerk import ClerkService
from app.utils.dependencies import get_bearer_token

log = logging.getLogger(__name__)


class ClerkController:
    def __init__(self, service: ClerkService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.post(
            "/organizations/create",
            response_model=CreateOrganizationResponse,
        )
        async def create_organization(
            input: CreateOrganizationRequest,
            # Use the dependency to get authenticated state
            bearer_token: str = Depends(
                get_bearer_token
            ),  # TODO: Authenticate https://github.com/clerk/clerk-sdk-python
        ):

            response: CreateOrganizationResponse = await self.service.create_organization(
                input=input
            )

            log.info(f"Clerk organization created with ID: {response.id}")
            return response
