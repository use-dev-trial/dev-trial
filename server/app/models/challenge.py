from typing import Optional

from app.models.database import DatabaseObjectMixin
from app.models.question import Question
from pydantic import BaseModel, Field


class Challenge(BaseModel):
    id: str = Field(description="The ID of the challenge as it is stored in the database.")
    name: Optional[str] = Field(
        default=None,
        description="The name of the challenge.",
    )
    description: Optional[str] = Field(
        default=None,
        description="The description of the challenge.",
    )


class ChallengeDB(Challenge, DatabaseObjectMixin):
    pass


class CreateChallengeRequest(BaseModel):
    name: str = Field(description="The name of the challenge.")
    description: str = Field(description="The description of the challenge.")
    question_id: str = Field(description="The ID of the question that the challenge is based on.")


class ChallengeResponse(BaseModel):
    id: str = Field(description="The ID of the challenge as it is stored in the database.")
    name: str = Field(description="The name of the challenge.")
    description: str = Field(description="The description of the challenge.")
    question_id: str = Field(description="The ID of the question that the challenge is based on.")

class GetChallengeResponse(BaseModel):
    id: str = Field(description="The ID of the challenge as it is stored in the database.")
    name: str = Field(description="The name of the challenge.")
    description: str = Field(description="The description of the challenge.")
    question: Question = Field(description="The question that the challenge is based on.")
    
    