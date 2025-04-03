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

    # Join Tables
    CHALLENGE_QUESTION = "challenge_question"
    QUESTION_FILE = "question_file"
    QUESTION_TEST_CASE = "question_test_case"


class DatabaseObjectMixin(BaseModel):
    user_id: str = Field(description="The ID of the user who created the object.")
    created_at: datetime = Field(description="The date and time when the question was created.")
    updated_at: datetime = Field(
        description="The date and time when the question was last updated."
    )


class UpsertMixin(BaseModel):
    question_id: str = Field(
        description="The ID of the question to update the foreign key or join table for."
    )
