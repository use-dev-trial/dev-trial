from typing import Optional

from pydantic import BaseModel, Field

from app.models.database import DatabaseObjectMixin
from app.models.file import File
from app.models.problem import Problem
from app.models.test_case import TestCase


class Question(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    problem: Optional[Problem] = Field(
        default=None,
        description="The problem description that the agent is trying to create for the user. None if problem description creation has not commenced.",
    )
    files: Optional[list[File]] = Field(
        default=None,
        description="The files which the candidate must use to reference/modify to successfully complete the question.",
    )
    test_cases: Optional[list[TestCase]] = Field(
        default=None,
        description="The test cases which the candidate must pass to successfully complete the question.",
    )


class QuestionDB(Question, DatabaseObjectMixin):
    pass
