from pydantic import BaseModel, Field

from app.models.database import DatabaseObjectMixin


class TestCase(BaseModel):
    description: str = Field(description="The description of the test case.")
    # TODO: Add other fields such as expected output, etc.


class TestCaseDB(TestCase, DatabaseObjectMixin):
    pass
