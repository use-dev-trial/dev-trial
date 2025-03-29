from typing import Optional

from pydantic import BaseModel, Field

from app.models.database import DatabaseObjectMixin
from app.models.file import File
from app.models.problem import Problem
from app.models.test_case import TestCase


class Files(BaseModel):
    files: list[File] = Field(
        description="The files which the candidate must pass to successfully complete the question."
    )


class TestCases(BaseModel):
    test_cases: list[TestCase] = Field(
        description="The test cases which the candidate must pass to successfully complete the question."
    )


class Question(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    problem: Optional[Problem] = Field(
        default=None,
        description="The problem description that the agent is trying to create for the user. None if problem description creation has not commenced.",
    )
    files: Optional[Files] = Field(
        default=None,
        description="The files which the agent is trying to create for the user. None if file creation has not commenced.",
    )
    test_cases: Optional[TestCases] = Field(
        default=None,
        description="The test cases which the agent is trying to create for the user. None if test case creation has not commenced.",
    )


class QuestionDB(Question, DatabaseObjectMixin):
    pass
