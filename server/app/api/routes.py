import logging

from fastapi import APIRouter

from app.controllers.challenges import ChallengesController
from app.controllers.messages import MessagesController
from app.controllers.problems import ProblemsController
from app.controllers.questions import QuestionsController
from app.services.challenges import ChallengesService
from app.services.messages import MessagesService
from app.services.problems import ProblemsService
from app.services.questions import QuestionsService

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


### Problems


def get_problems_controller_router():
    service = ProblemsService()
    return ProblemsController(service=service).router


router.include_router(
    get_problems_controller_router(),
    tags=["problems"],
    prefix="/api/problems",
)


### Questions


def get_questions_controller_router():
    service = QuestionsService()
    return QuestionsController(service=service).router


router.include_router(
    get_questions_controller_router(),
    tags=["questions"],
    prefix="/api/questions",
)
