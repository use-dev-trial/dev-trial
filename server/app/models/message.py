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
    question_id: Optional[str] = Field(
        description="The ID of the question which this message relates to. It is None if the user manually decides to create a new question, or if it is a new chat."
    )  # The question ID could possibly be just the message ID, but I imagine a world where we might want to allow users to reuse the same chat history context for to generate multiple (follow-up) questions. When that use case arrives, the LLM will make a decision to set the question ID to None
    content: str = Field(description="The content of the user message to be sent to the assistant.")


class MessageResponse(BaseModel):
    id: str = Field(
        description="The ID of the chat history which this message belongs to. This should be passed back to the server during the next request."
    )
    content: str = Field(description="The response from the assistant to be sent back to the user.")
    question: Question = Field(
        description="The (partially) complete question object that was generated so far by the assistant."
    )
