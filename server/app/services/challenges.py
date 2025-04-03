import logging

from supabase._async.client import AsyncClient as Client

from app.models.challenge import (
    Challenge,
    CreateChallengeRequest,
    GetAllChallengesResponse,
)
from app.models.database import Table

log = logging.getLogger(__name__)


class ChallengesService:
    async def get_challenge(self, client: Client, challenge_id: str) -> Challenge:
        select_challenge_result = (
            await client.table(Table.CHALLENGES).select("*").eq("id", challenge_id).execute()
        )
        if not select_challenge_result.data:
            raise ValueError(f"Challenge with id {challenge_id} not found.")

        return Challenge(
            id=select_challenge_result.data[0]["id"],
            name=select_challenge_result.data[0]["name"],
            description=select_challenge_result.data[0]["description"],
        )

    async def create_challenge(
        self, client: Client, challenge: CreateChallengeRequest
    ) -> Challenge:
        insert_challenge_result = (
            await client.table(Table.CHALLENGES)
            .insert(
                {
                    "name": challenge.name,
                    "description": challenge.description,
                }
            )
            .execute()
        )
        return Challenge(
            id=insert_challenge_result.data[0]["id"],
            name=challenge.name,
            description=challenge.description,
        )

    async def get_all_challenges(self, client: Client) -> GetAllChallengesResponse:
        select_challenges_result = await client.table(Table.CHALLENGES).select("*").execute()

        if not select_challenges_result.data:
            # Return empty list if no challenges found
            return GetAllChallengesResponse(challenges=[])

        challenges = []
        for challenge_data in select_challenges_result.data:
            challenges.append(
                Challenge(
                    id=challenge_data["id"],
                    name=challenge_data["name"],
                    description=challenge_data["description"],
                )
            )

        return GetAllChallengesResponse(challenges=challenges)
