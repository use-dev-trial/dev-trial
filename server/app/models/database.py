from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class Table(StrEnum):
    MESSAGES = "messages"
    PROBLEMS = "problems"
    FILES = "files"
    TEST_CASES = "test_cases"
    CHALLENGES = "challenges"
    QUESTIONS = "questions"
    METRICS = "metrics"

    # Join Tables
    CHALLENGE_QUESTION = "challenge_question"
    QUESTION_FILE = "question_file"
    QUESTION_TEST_CASE = "question_test_case"
    QUESTION_METRIC = "question_metric"


class DatabaseObjectMixin(BaseModel):
    org_id: str = Field(description="The ID of the orgainsation which owns the object.")
    created_at: datetime = Field(description="The date and time when the question was created.")
    updated_at: datetime = Field(
        description="The date and time when the question was last updated."
    )


class UpsertMixin(BaseModel):
    question_id: str = Field(
        description="The ID of the question to update the foreign key or join table for."
    )
