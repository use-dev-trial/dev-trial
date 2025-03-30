import logging

from supabase._async.client import AsyncClient as Client

from app.models.challenge import Challenge, CreateChallengeRequest
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
