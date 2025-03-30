import httpx
from fastapi import Header, HTTPException


async def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=httpx.codes.UNAUTHORIZED, detail="Invalid token format")
    return authorization.removeprefix("Bearer ").strip()
