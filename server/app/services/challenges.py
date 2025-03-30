import logging

from supabase._async.client import AsyncClient as Client

from app.models.challenge import Challenge
from app.models.database import Table

log = logging.getLogger(__name__)


class ChallengesService:
    async def get_challenge(self, client: Client, challenge_id: str) -> Challenge | None:
        pass

    async def create_challenge(self, client: Client, challenge: Challenge) -> Challenge:
        insert_challenge_result = (
            await client.table(Table.CHALLENGES)
            .insert(
                {
                    "name": challenge.name,
                    "description": challenge.description,
                    "problem_id": challenge.problem_id,
                }
            )
            .execute()
        )
        return Challenge(
            id=insert_challenge_result.data[0]["id"],
            name=challenge.name,
            description=challenge.description,
            problem_id=challenge.problem_id,
        )

