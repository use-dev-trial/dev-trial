import logging

from supabase._async.client import AsyncClient as Client

from app.models.challenge import (
    Challenge,
    CreateChallengeRequest,
    GetAllChallengesResponse,
    GetChallengeResponse,
)
from app.models.database import Table
from app.services.messages import retrieve_existing_question

log = logging.getLogger(__name__)


class ChallengesService:
    async def get_challenge(self, client: Client, challenge_id: str) -> GetChallengeResponse:
        select_challenge_result = (
            await client.table(Table.CHALLENGES).select("*").eq("id", challenge_id).execute()
        )
        if not select_challenge_result.data:
            raise ValueError(f"Challenge with id {challenge_id} not found.")

        question_id_list_result = await (
            client.table(Table.CHALLENGE_QUESTION)
            .select("question_id")
            .eq("challenge_id", challenge_id)
            .execute()
        )

        log.info("question_id_list_result", len(question_id_list_result.data))

        questions = []
        for question_id in question_id_list_result.data:
            question = await retrieve_existing_question(
                client=client, question_id=question_id["question_id"]
            )
            questions.append(question)

        log.info("questions", questions)

        return GetChallengeResponse(
            id=select_challenge_result.data[0]["id"],
            name=select_challenge_result.data[0]["name"],
            description=select_challenge_result.data[0]["description"],
            question=questions,
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
