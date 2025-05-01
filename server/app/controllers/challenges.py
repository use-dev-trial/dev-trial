import logging

from fastapi import APIRouter, Depends
from supabase._async.client import AsyncClient as Client

from app.models.challenge import (
    Challenge,
    CreateChallengeRequest,
    GetAllChallengesResponse,
)
from app.services.challenges import ChallengesService
from app.utils.dependencies import init_db_client

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

        @router.delete(
            "/{challenge_id}",
        )
        async def delete_challenge(challenge_id: str, client: Client = Depends(init_db_client)):
            log.info(f"Deleting challenge with id {challenge_id}...")
            await self.service.delete_challenge(challenge_id=challenge_id, client=client)
            log.info("Deleted challenge with id %s", challenge_id)

        @router.get(
            "",
            response_model=GetAllChallengesResponse,
        )
        async def get_all_challenges(
            client: Client = Depends(init_db_client),
        ) -> GetAllChallengesResponse:
            log.info("Getting all challenges...")
            response: GetAllChallengesResponse = await self.service.get_all_challenges(
                client=client
            )
            log.info("Retrieved %d challenges", len(response.challenges))
            return response

        @router.post(
            "",
            response_model=Challenge,
        )
        async def create_challenge(
            challenge: CreateChallengeRequest, client: Client = Depends(init_db_client)
        ) -> Challenge:
            log.info("Creating challenge: %s", challenge.name)
            response: Challenge = await self.service.create_challenge(
                challenge=challenge, client=client
            )
            log.info("Created challenge: %s", response.name)
            return response
