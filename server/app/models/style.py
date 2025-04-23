from pydantic import BaseModel, Field


class Style(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    style: str = Field(
        description="Description of the coding style/standard which the candidate must follow."
    )
