from pydantic import BaseModel, Field

from app.models.database import UpsertMixin


class TestCase(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    description: str = Field(description="The description of the test case.")
    input: str = Field(description="The input of the test case.")
    expected_output: str = Field(description="The expected output of the test case.")


class UpsertTestCaseRequest(TestCase, UpsertMixin):
    pass


class UpsertTestCaseResponse(UpsertTestCaseRequest):
    pass
