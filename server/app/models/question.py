from pydantic import BaseModel, Field

from app.models.database import DatabaseObjectMixin
from app.models.file import File
from app.models.test_case import TestCase


class Files(BaseModel):
    files: list[File] = Field(
        description="The files which the candidate must pass to successfully complete the question."
    )


class TestCases(BaseModel):
    test_cases: list[TestCase] = Field(
        description="The test cases which the candidate must pass to successfully complete the question."
    )


class Problem(BaseModel):
    title: str = Field(description="The title of the question.")
    description: str = Field(description="The general overview of the question.")
    requirements: list[str] = Field(
        description="The requirements which the candidate must meet to successfully complete the question."
    )


class Question(Problem, Files, TestCases):
    pass


class QuestionDB(Question, DatabaseObjectMixin):
    pass
