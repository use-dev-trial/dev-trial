import logging

from supabase._async.client import AsyncClient as Client

from app.models.challenge import Challenge

log = logging.getLogger(__name__)


class ChallengesService:
    async def get_challenge(self, client: Client, challenge_id: str) -> Challenge | None:
        pass
