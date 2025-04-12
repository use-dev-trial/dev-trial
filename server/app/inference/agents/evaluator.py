from openai import AsyncOpenAI
from openai.types.chat import ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam
from pydantic import BaseModel, Field, field_validator

from app.inference.prompts.evaluator import (
    EVALUATOR_SYSTEM_PROMPT,
    get_evaluator_user_prompt,
)
from app.models.file import File
from app.models.grading import Metric
from app.utils.llm import LLMType


class CodeExcerpt(BaseModel):
    file_name: str = Field(description="The name of the file")
    code: str = Field(
        description="The code excerpt that is relevant to the metric used as evidence for the reasoning and score"
    )


class Grade(BaseModel):
    metric_id: str = Field(description="The ID of the metric that was evaluated")
    score: int = Field(description="The score out of 10")
    reason: str = Field(description="The reasoning behind the score")
    snapshots: list[CodeExcerpt] = Field(
        description="The code excerpts that were used to support the reasoning and score"
    )

    @field_validator("score")
    @classmethod
    def validate_score(cls, v: int) -> int:
        """
        Validates that the score is between 0 and 10.
        """
        if not 0 <= v <= 10:
            raise ValueError("Score must be between 0 and 10")
        return v


class EvaluatorResponse(BaseModel):
    grades: list[Grade] = Field(description="The grades for each metric")


client = AsyncOpenAI()


class Evaluator:
    llm_type: LLMType = LLMType.GPT4O_MINI
    system_prompt: str = EVALUATOR_SYSTEM_PROMPT

    async def evaluate(self, metrics: list[Metric], files: list[File]) -> EvaluatorResponse:
        user_prompt: str = get_evaluator_user_prompt(files=files, metrics=metrics)
        response = await client.beta.chat.completions.parse(
            model=self.llm_type,
            messages=[
                ChatCompletionSystemMessageParam(role="system", content=self.system_prompt),
                ChatCompletionUserMessageParam(role="user", content=user_prompt),
            ],
            response_format=EvaluatorResponse,
        )
        return EvaluatorResponse.model_validate(response)
