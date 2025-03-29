from typing import Optional

from pydantic import BaseModel, Field

from app.models.question import Question


class AgentState(BaseModel):
    question: Optional[Question] = Field(
        default=None,
        description="The question that the agent is trying to create for the user. None if question creation has not commenced.",
    )
