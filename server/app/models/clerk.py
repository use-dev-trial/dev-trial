from pydantic import BaseModel, Field


class CreateOrganizationRequest(BaseModel):
    name: str = Field(description="The name of the new organization as defined by the user")
    user_id: str = Field(
        description="The ID of the user that will be credited with the organization creation"
    )


class CreateOrganizationResponse(BaseModel):
    id: str = Field(description="The ID of the new organization")
