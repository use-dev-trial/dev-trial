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
    id: str = Field(description="The ID of the question as it is stored in the database.")
    created_at: datetime = Field(description="The date and time when the question was created.")
    updated_at: datetime = Field(
        description="The date and time when the question was last updated."
    )
