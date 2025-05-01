from pydantic import BaseModel, Field

from app.models.database import UpsertMixin


class Metric(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    content: str = Field(
        description="Description of the coding style/standard which the candidate must follow."
    )


class UpsertMetricRequest(Metric, UpsertMixin):
    pass


class UpsertMetricResponse(UpsertMetricRequest):
    # TODO: Might have metadata to return in the future. For now, the schema is exactly the same
    pass


class GetAllMetricsResponse(BaseModel):
    metrics: list[Metric] = Field(description="The metrics associated with the question")


TEMPLATE_METRICS: list[str] = [
    "Code solves the problem correctly in the most straightforward way possible. There isn't over-engineering",
    "Minimal code duplication by abstracting and reusing code sensibly",
    "Maintains consistent naming conventions that are clear and descriptive",
    "Follows the single responsibility principle for functions as much as possible",
    "Avoids deeply nested loops or conditionals. Guard clauses are used appropriately to improve readability",
    "Comments are used appropriately to explain important parts of the logic",
    "Defensive programming is used appropriately to avoid errors in critical sections of the code",
    "Constants are used in place of magic numbers where appropriate",
]
