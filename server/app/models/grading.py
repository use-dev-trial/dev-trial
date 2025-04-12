from pydantic import BaseModel, Field, field_validator


class Metric(BaseModel):
    id: str = Field(description="The ID of the metric as it is stored in the database.")
    question_id: str = Field(
        description="The ID of the question that the metric is associated with"
    )
    content: str = Field(description="The description of the metric")

    @field_validator("question_id")
    @classmethod
    def validate_and_trim_question_id(cls, v: str) -> str:
        """
        Validates that the id is not empty after trimming whitespace,
        and returns the trimmed version.
        """
        trimmed_v = v.strip()

        if not trimmed_v:
            raise ValueError("Question id cannot be empty or contain only whitespace for a metric")

        return trimmed_v
