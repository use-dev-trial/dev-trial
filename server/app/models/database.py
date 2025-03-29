from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class Table(StrEnum):
    MESSAGES = "messages"


class DatabaseObjectMixin(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    created_at: datetime = Field(description="The date and time when the question was created.")
    updated_at: datetime = Field(
        description="The date and time when the question was last updated."
    )
