from supabase._async.client import AsyncClient as Client

from app.models.database import Table
from app.models.file import File
from app.models.problem import Problem
from app.models.question import Question
from app.models.test_case import TestCase


class QuestionsService:
    async def get_question(self, question_id: str, client: Client) -> Question:
        select_question_result = (
            await client.table(Table.QUESTIONS).select("*").eq("id", question_id).execute()
        )
        if not select_question_result.data:
            raise ValueError(f"Question with id {question_id} not found.")

        problem: Problem = Problem(
            id="",
            title="",
            description="",
            requirements=[],
        )
        if select_question_result.data[0]["problem_id"]:
            select_problem_result = (
                await client.table(Table.PROBLEMS)
                .select("*")
                .eq("id", select_question_result.data[0]["problem_id"])
                .execute()
            )

            problem = Problem(
                id=select_problem_result.data[0]["id"],
                title=select_problem_result.data[0]["title"],
                description=select_problem_result.data[0]["description"],
                requirements=select_problem_result.data[0]["requirements"],
            )

        select_test_case_ids_result = (
            await client.table(Table.QUESTION_TEST_CASE)
            .select("*")
            .eq("question_id", question_id)
            .execute()
        )

        test_cases: list[TestCase] = []
        for result in select_test_case_ids_result.data:
            select_test_case_result = (
                await client.table(Table.TEST_CASES)
                .select("*")
                .eq("id", result["test_case_id"])
                .execute()
            )
            test_cases.append(
                TestCase(
                    id=select_test_case_result.data[0]["id"],
                    description=select_test_case_result.data[0]["description"],
                )
            )

        select_file_ids_result = (
            await client.table(Table.QUESTION_FILE)
            .select("*")
            .eq("question_id", question_id)
            .execute()
        )

        files: list[File] = []
        for result in select_file_ids_result.data:
            select_file_result = (
                await client.table(Table.FILES).select("*").eq("id", result["file_id"]).execute()
            )
            files.append(
                File(
                    id=select_file_result.data[0]["id"],
                    name=select_file_result.data[0]["name"],
                    code=select_file_result.data[0]["code"],
                )
            )

        return Question(
            id=question_id,
            problem=problem,
            files=files,
            test_cases=test_cases,
        )
