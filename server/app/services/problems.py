from supabase._async.client import AsyncClient as Client

from app.models.database import Table
from app.models.problem import Problem


class ProblemsService:

    async def get_problem(self, problem_id: str, client: Client) -> Problem:
        get_problem_result = (
            await client.table(Table.PROBLEMS).select("*").eq("id", problem_id).execute()
        )
        return Problem.model_validate(get_problem_result.data[0])

    async def upsert_problem(self, input: Problem, client: Client) -> Problem:
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

        return Problem(
            id=upsert_problem_result.data[0]["id"],
            title=upsert_problem_result.data[0]["title"],
            description=upsert_problem_result.data[0]["description"],
            requirements=upsert_problem_result.data[0]["requirements"],
            question_id=question_id,
        )
