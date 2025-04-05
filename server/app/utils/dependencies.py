import os

import httpx
from fastapi import Header, HTTPException

from app.utils.database import db_client

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")


async def init_db_client(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=httpx.codes.UNAUTHORIZED, detail="Invalid token format")

    return await db_client(token=authorization.removeprefix("Bearer ").strip())


async def get_bearer_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=httpx.codes.UNAUTHORIZED, detail="Invalid token format")
    return authorization.removeprefix("Bearer ").strip()
