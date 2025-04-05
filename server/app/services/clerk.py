import os
from typing import Optional

import httpx
from clerk_backend_api import (
    Clerk,
    CreateOrganizationRequestBody,
)
from clerk_backend_api import Organization as ClerkOrganization
from fastapi import HTTPException
from slugify import slugify

from app.models.clerk import CreateOrganizationRequest, CreateOrganizationResponse

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")


class ClerkService:
    async def create_organization(
        self, input: CreateOrganizationRequest
    ) -> CreateOrganizationResponse:
        async with Clerk(bearer_auth=CLERK_SECRET_KEY) as clerk:
            org_slug: str = slugify(input.name)

            if not org_slug:
                raise HTTPException(
                    status_code=httpx.codes.BAD_REQUEST,
                    detail="Failed to generate a valid slug from the name.",
                )

            request = CreateOrganizationRequestBody(
                name=input.name,
                created_by=input.user_id,
                slug=org_slug,
            )

            res: Optional[ClerkOrganization] = await clerk.organizations.create_async(
                request=request
            )

            if res is None or not res.id:
                raise HTTPException(
                    status_code=httpx.codes.FAILED_DEPENDENCY,
                    detail="Clerk API returned an unexpected null or incomplete response during organization creation.",
                )

            return CreateOrganizationResponse(
                id=res.id,
            )
