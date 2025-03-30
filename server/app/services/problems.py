from postgrest.types import CountMethod
from supabase._async.client import AsyncClient as Client

from app.models.database import Table
from app.models.problem import UpsertProblemRequest, UpsertProblemResponse


class ProblemsService:
    async def upsert_problem(
        self, input: UpsertProblemRequest, client: Client
    ) -> UpsertProblemResponse:
        question_id: str = input.question_id
        if input.id:
            # Update existing entry in the problems table
            count_result = (
                await client.table(Table.PROBLEMS)
                .select("id", count=CountMethod.exact)
                .eq("id", input.id)
                .execute()
            )
            if not count_result.count:
                raise ValueError(
                    f"Problem with id {input.id} not found when trying to update problem."
                )
            elif count_result.count > 1:
                raise ValueError(
                    f"Multiple problems with id {input.id} found when trying to update problem."
                )
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
            # Create a new entry in the problems table
            upsert_problem_result = (
                await client.table(Table.PROBLEMS)
                .insert(
                    {
                        "title": input.title,
                        "description": input.description,
                        "requirements": input.requirements,
                    }
                )
                .execute()
            )
            if not question_id:  # Empty string indicates that the question is not created yet
                question_result = (
                    await client.table(Table.QUESTIONS)
                    .insert(
                        {
                            "problem_id": upsert_problem_result.data[0]["id"],
                        }
                    )
                    .execute()
                )
                question_id = question_result.data[0]["id"]
            else:
                await client.table(Table.QUESTIONS).update(
                    {
                        "problem_id": upsert_problem_result.data[0]["id"],
                    }
                ).eq("id", question_id).execute()

        return UpsertProblemResponse(
            id=upsert_problem_result.data[0]["id"],
            title=upsert_problem_result.data[0]["title"],
            description=upsert_problem_result.data[0]["description"],
            requirements=upsert_problem_result.data[0]["requirements"],
            question_id=question_id,
        )
