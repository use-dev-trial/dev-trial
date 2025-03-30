import logging

from fastapi import APIRouter

from app.controllers.challenges import ChallengesController
from app.controllers.messages import MessagesController
from app.services.challenges import ChallengesService
from app.services.messages import MessagesService

log = logging.getLogger(__name__)

router = APIRouter()

### Health check


@router.get("/status")
async def status():
    log.info("Status endpoint called")
    return {"status": "ok"}


### Messages


def get_messages_controller_router():
    service = MessagesService()
    return MessagesController(service=service).router


router.include_router(
    get_messages_controller_router(),
    tags=["messages"],
    prefix="/api/messages",
)


### Challenges


def get_challenges_controller_router():
    service = ChallengesService()
    return ChallengesController(service=service).router


router.include_router(
    get_challenges_controller_router(),
    tags=["challenges"],
    prefix="/api/challenges",
)
