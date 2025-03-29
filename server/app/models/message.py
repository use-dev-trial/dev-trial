from enum import StrEnum
from typing import Optional

from pydantic import BaseModel, Field

from app.models.question import Question


class Role(StrEnum):
    ASSISTANT = "assistant"
    USER = "user"


class Message(BaseModel):
    role: Role
    content: str


class MessageRequest(BaseModel):
    id: Optional[str] = Field(
        description="The ID of the chat history which this message belongs to. It is None if this is a new chat."
    )  # Do not set default value to None so that we fail fast when the client does not pass id in
    content: str = Field(description="The content of the user message to be sent to the assistant.")


class MessageResponse(BaseModel):
    id: str = Field(
        description="The ID of the chat history which this message belongs to. This should be passed back to the server during the next request."
    )
    content: str = Field(description="The response from the assistant to be sent back to the user.")
    question: Question = Field(
        description="The (partially) complete question object that was generated so far by the assistant."
    )
