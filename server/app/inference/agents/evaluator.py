from agents import Agent
from pydantic import BaseModel, Field

from app.inference.constants import AgentNames
from app.inference.prompts.evaluator import (
    EVALUATOR_SYSTEM_PROMPT,
    get_evaluator_user_prompt,
)
from app.models.file import File
from app.models.grading import Metric


class EvaluatorResponse(BaseModel):
    metri
    score: int = Field(description="The score")


class Evaluator:
    agent: Agent
    name: AgentNames = AgentNames.EVALUATOR
    system_prompt: str = EVALUATOR_SYSTEM_PROMPT

    def __init__(self):
        self.agent = Agent(name=self.name, instructions=self.system_prompt)

    async def evaluate(self, metrics: list[Metric], files: list[File]) -> str:
        user_prompt: str = get_evaluator_user_prompt(files=files, metrics=metrics)

        return user_prompt
