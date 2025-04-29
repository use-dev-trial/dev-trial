from pydantic import BaseModel, Field


class Problem(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    question_id: str = Field(description="The ID of the question as it is stored in the database.")
    title: str = Field(description="The title of the question.")
    description: str = Field(description="The general overview of the question.")
    requirements: list[str] = Field(
        description="The requirements which the candidate must meet to successfully complete the question.",
    )


class UpsertProblemRequest(Problem):
    pass


class UpsertProblemResponse(UpsertProblemRequest):
    # TODO: Might have metadata to return in the future. For now, the schema is exactly the same
    pass
