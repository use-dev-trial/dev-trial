from supabase._async.client import AsyncClient as Client

from app.models.database import Table
from app.models.problem import UpsertProblemRequest, UpsertProblemResponse


class ProblemsService:
    async def upsert_problem(
        self, input: UpsertProblemRequest, client: Client
    ) -> UpsertProblemResponse:
        question_id: str = input.question_id
        if input.id:
            upsert_problem_result = (
                await client.table(Table.PROBLEMS)
                .update(
                    {
                        "title": input.title,
                        "description": input.description,
                        "requirements": input.requirements,
                    }
                )
                .eq("id", input.id)
                .execute()
            )
        else:  # id will be empty string if its a fresh problem
            if not question_id:  # Empty string indicates that the question is not created yet
                question_result = await client.table(Table.QUESTIONS).insert({}).execute()
                question_id = question_result.data[0]["id"]
            # Create a new entry in the problems table
            upsert_problem_result = (
                await client.table(Table.PROBLEMS)
                .insert(
                    {
                        "question_id": question_id,
                        "title": input.title,
                        "description": input.description,
                        "requirements": input.requirements,
                    }
                )
                .execute()
            )

        return UpsertProblemResponse(
            id=upsert_problem_result.data[0]["id"],
            title=upsert_problem_result.data[0]["title"],
            description=upsert_problem_result.data[0]["description"],
            requirements=upsert_problem_result.data[0]["requirements"],
            question_id=question_id,
        )
