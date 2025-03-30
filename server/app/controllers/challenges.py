import logging

from app.models.challenge import Challenge
from app.services.challenges import ChallengesService
from app.utils.dependencies import init_db_client
from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient as Client

log = logging.getLogger(__name__)


class ChallengesController:
    def __init__(self, service: ChallengesService):
        self.router = APIRouter()
        self.service = service
        self.setup_routes()

    def setup_routes(self):
        router = self.router

        @router.get(
            "/{challenge_id}",
            response_model=Challenge,
        )
        async def get_challenge(
            challenge_id: str, client: Client = Depends(init_db_client)
        ) -> Challenge:
            log.info(f"Getting challenge with id {challenge_id}...")
            response: Challenge = await self.service.get_challenge(
                challenge_id=challenge_id, client=client
            )
            log.info("Challenge: %s", response)
            return response

        @router.post(
            "/",
            response_model=Challenge,
        )
        async def create_challenge(
            challenge: Challenge, client: Client = Depends(init_db_client)
        ) -> Challenge:
            log.info("Creating challenge: %s", challenge)
            response: Challenge = await self.service.create_challenge(
                challenge=challenge, client=client
            )
            log.info("Challenge: %s", response)
            return response
