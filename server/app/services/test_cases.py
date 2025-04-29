from app.models.test_case import UpsertTestCaseRequest
from app.models.test_case import UpsertTestCaseResponse
from supabase._async.client import AsyncClient as Client


class TestCasesService:
    async def upsert_test_case(
        self, input: UpsertTestCaseRequest, client: Client
    ) -> UpsertTestCaseResponse:
        question_id: str = input.question_id
        if input.id:
            upsert_test_case_result = (
                await client.table("test_cases")
                .update(
                    {
                        "description": input.description,
                        "input": input.input,
                        "expected_output": input.expected_output,
                    }
                )
                .eq("id", input.id)
                .execute()
            )
        else:  # id will be empty string if its a fresh test case
            if not question_id:  # Empty string indicates that the question is not created yet
                question_result = await client.table("questions").insert({}).execute()
                question_id = question_result.data[0]["id"]
            # Create a new entry in the test_cases table
            upsert_test_case_result = (
                await client.table("test_cases")
                .insert(
                    {
                        "description": input.description,
                        "input": input.input,
                        "expected_output": input.expected_output,
                    }
                )
                .execute()
            )
            await client.table("question_test_case").insert(
                {
                    "question_id": question_id,
                    "test_case_id": upsert_test_case_result.data[0]["id"],
                }
            ).execute()

        return UpsertTestCaseResponse(
            id=upsert_test_case_result.data[0]["id"],
            description=upsert_test_case_result.data[0]["description"],
            input=upsert_test_case_result.data[0]["input"],
            expected_output=upsert_test_case_result.data[0]["expected_output"],
            question_id=question_id,
        )
