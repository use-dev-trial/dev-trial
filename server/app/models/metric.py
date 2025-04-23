from pydantic import BaseModel, Field


class Metric(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    content: str = Field(
        description="Description of the coding style/standard which the candidate must follow."
    )
