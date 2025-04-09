import asyncio

from supabase._async.client import AsyncClient as Client

from app.models.database import Table
from app.models.file import File
from app.models.problem import Problem
from app.models.question import Question
from app.models.test_case import TestCase


class QuestionsService:

    async def get_all_questions(self, client: Client) -> list[Question]:
        question_id_list_result = await client.table(Table.QUESTIONS).select("id").execute()

        tasks = [
            self.get_question_by_id(question_id=question["id"], client=client)
            for question in question_id_list_result.data
        ]

        return await asyncio.gather(*tasks)

    async def get_questions_by_challenge_id(
        self, challenge_id: str, client: Client
    ) -> list[Question]:
        question_id_list_result = await (
            client.table(Table.CHALLENGE_QUESTION)
            .select("question_id")
            .eq("challenge_id", challenge_id)
            .execute()
        )

        tasks = [
            self.get_question_by_id(question_id=question["question_id"], client=client)
            for question in question_id_list_result.data
        ]

        return await asyncio.gather(*tasks)

    async def get_test_cases_by_question_id(
        self, question_id: str, client: Client
    ) -> list[TestCase]:
        test_case_ids_result = await (
            client.table(Table.QUESTION_TEST_CASE)
            .select("test_case_id")
            .eq("question_id", question_id)
            .execute()
        )

        test_case_ids = (
            [row["test_case_id"] for row in test_case_ids_result.data]
            if test_case_ids_result.data
            else []
        )

        if not test_case_ids:
            return []

        test_cases_result = await (
            client.table(Table.TEST_CASES).select("*").in_("id", test_case_ids).execute()
        )

        test_cases = (
            [
                TestCase(id=row["id"], description=row["description"])
                for row in test_cases_result.data
            ]
            if test_cases_result.data
            else []
        )

        return test_cases

    async def get_question_by_id(self, question_id: str, client: Client) -> Question:
        question_task = client.table(Table.QUESTIONS).select("*").eq("id", question_id).execute()
        test_case_ids_task = (
            client.table(Table.QUESTION_TEST_CASE)
            .select("test_case_id")
            .eq("question_id", question_id)
            .execute()
        )
        file_ids_task = (
            client.table(Table.QUESTION_FILE)
            .select("file_id")
            .eq("question_id", question_id)
            .execute()
        )

        question_result, test_case_ids_result, file_ids_result = await asyncio.gather(
            question_task, test_case_ids_task, file_ids_task
        )

        if not question_result.data:
            raise ValueError(f"Question with id {question_id} not found.")

        question_data = question_result.data[0]
        problem_id = question_data.get("problem_id")
        test_case_ids = (
            [row["test_case_id"] for row in test_case_ids_result.data]
            if test_case_ids_result.data
            else []
        )
        file_ids = [row["file_id"] for row in file_ids_result.data] if file_ids_result.data else []

        problem_task = (
            client.table(Table.PROBLEMS).select("*").eq("id", problem_id).execute()
            if problem_id
            else None
        )
        test_cases_task = (
            client.table(Table.TEST_CASES).select("*").in_("id", test_case_ids).execute()
            if test_case_ids
            else None
        )
        files_task = (
            client.table(Table.FILES).select("*").in_("id", file_ids).execute()
            if file_ids
            else None
        )

        problem_result, test_cases_result, files_result = await asyncio.gather(
            problem_task or asyncio.sleep(0),
            test_cases_task or asyncio.sleep(0),
            files_task or asyncio.sleep(0),
        )

        problem = (
            Problem(
                id=problem_result.data[0]["id"],
                title=problem_result.data[0]["title"],
                description=problem_result.data[0]["description"],
                requirements=problem_result.data[0]["requirements"],
            )
            if problem_result and problem_result.data
            else Problem(id="", title="", description="", requirements=[])
        )

        test_cases = (
            [
                TestCase(id=row["id"], description=row["description"])
                for row in test_cases_result.data
            ]
            if test_cases_result and test_cases_result.data
            else []
        )

        files = (
            [File(id=row["id"], name=row["name"], code=row["code"]) for row in files_result.data]
            if files_result and files_result.data
            else []
        )

        return Question(id=question_id, problem=problem, files=files, test_cases=test_cases)

    async def run_tests(self, question_id: str, files: list[File], client: Client) -> None:
        test_cases = await self.get_test_cases_by_question_id(
            question_id=question_id, client=client
        )
        print(test_cases)
        pass
