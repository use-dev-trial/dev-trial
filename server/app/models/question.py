from pydantic import BaseModel, Field, field_validator

from app.models.file import File
from app.models.metric import Metric
from app.models.problem import Problem
from app.models.test_case import TestCase


# Avoid making the attribute Optional because we are sharing this model for inference
class Question(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    problem: Problem = Field(
        description="The problem description that the agent is trying to create for the user. None if problem description creation has not commenced.",
    )
    files: list[File] = Field(
        description="The files which the candidate must use to reference/modify to successfully complete the question.",
    )
    test_cases: list[TestCase] = Field(
        description="The test cases which the candidate must pass to successfully complete the question.",
    )
    metrics: list[Metric] = Field(
        description="The metrics which the candidate must follow to successfully complete the question.",
    )


class CreateTemplateQuestionRequest(BaseModel):
    challenge_id: str = Field(
        description="The ID of the challenge this template question is associated with.",
    )

    @field_validator("challenge_id")
    @classmethod
    def validate_challenge_id(cls, v):
        if not v:
            raise ValueError("Challenge ID is required.")
        return v


class AssociateQuestionWithChallengeRequest(BaseModel):
    question_id: str = Field(
        description="The ID of the question to associate with the challenge.",
    )
    challenge_id: str = Field(
        description="The ID of the challenge to associate the question with.",
    )


class RunTestsRequest(BaseModel):
    code: str = Field(
        description="The code which the candidate has written.",
    )
