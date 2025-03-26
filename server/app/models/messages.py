from enum import StrEnum

from pydantic import BaseModel, Field


class Role(StrEnum):
    ASSISTANT = "assistant"
    USER = "user"


class Message(BaseModel):
    role: Role
    content: str


class MessageRequest(BaseModel):
    content: str = Field(description="The content of the user message to be sent to the assistant.")


class MessageResponse(BaseModel):
    content: str = Field(description="The response from the assistant to be sent back to the user.")
