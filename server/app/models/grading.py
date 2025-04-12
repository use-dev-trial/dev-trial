from pydantic import BaseModel, Field, field_validator


class Metrics(BaseModel):
    id: str = Field(
        description="The ID of the question that the metrics are associated with. Question and Metrics have a 1:1 relationship."
    )
    metrics: list[str] = Field(
        description="The metrics to be upserted. Each metric is a string that will be inserted into the evaluator's system prompt. A score will be assigned to each metric based on the candidate's code quality"
    )

    @field_validator("id")
    @classmethod
    def validate_and_trim_id(cls, v: str) -> str:
        """
        Validates that the id is not empty after trimming whitespace,
        and returns the trimmed version.
        """
        trimmed_v = v.strip()

        if not trimmed_v:
            raise ValueError("Metrics id cannot be empty or contain only whitespace")

        return trimmed_v
