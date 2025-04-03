from typing import Optional

from pydantic import BaseModel, Field

from app.models.database import DatabaseObjectMixin


class Challenge(BaseModel):
    id: str = Field(description="The ID of the challenge as it is stored in the database.")
    name: Optional[str] = Field(
        description="The name of the challenge.",
    )
    description: Optional[str] = Field(
        description="The description of the challenge.",
    )


class ChallengeDB(Challenge, DatabaseObjectMixin):
    pass


class CreateChallengeRequest(BaseModel):
    name: str = Field(description="The name of the challenge.")
    description: str = Field(description="The description of the challenge.")


class GetAllChallengesResponse(BaseModel):
    challenges: list[Challenge] = Field(description="List of all challenges.")
