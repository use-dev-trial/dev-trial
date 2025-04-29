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
