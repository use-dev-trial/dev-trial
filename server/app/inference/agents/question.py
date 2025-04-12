import logging

from agents import Agent, ModelSettings, RunContextWrapper, handoff
from agents.extensions import handoff_filters
from pydantic import BaseModel, Field

from app.inference.constants import AgentNames
from app.inference.prompts.file_generator import get_file_generator_system_prompt
from app.inference.prompts.problem_generator import get_problem_generator_system_prompt
from app.inference.prompts.test_generator import get_test_generator_system_prompt
from app.inference.prompts.triager import get_triager_system_prompt
from app.inference.state import AgentState
from app.models.file import File
from app.models.question import Problem
from app.models.test_case import TestCase
from app.utils.llm import LLMType

log = logging.getLogger(__name__)


file_generator = Agent[AgentState](
    model=LLMType.GPT4O_MINI,
    model_settings=ModelSettings(
        temperature=0.0,
    ),
    name=AgentNames.FILE_GENERATOR,
    instructions=get_file_generator_system_prompt,
    output_type=list[File],
)

problem_generator = Agent[AgentState](
    model=LLMType.GPT4O_MINI,
    model_settings=ModelSettings(
        temperature=0.0,
    ),
    name=AgentNames.PROBLEM_GENERATOR,
    instructions=get_problem_generator_system_prompt,
    output_type=Problem,
)

test_generator = Agent[AgentState](
    model=LLMType.GPT4O_MINI,
    model_settings=ModelSettings(
        temperature=0.0,
    ),
    name=AgentNames.TEST_GENERATOR,
    instructions=get_test_generator_system_prompt,
    output_type=list[TestCase],
)


class HandoffReason(BaseModel):
    agent_name: AgentNames = Field(
        description="The name of the subagent that is being handed off to."
    )
    reason: str = Field(
        description="The reason for the handoff to the subagent. You should clearly state what you hope the subagent will accomplish through this handoff."
    )


async def on_handoff(ctx: RunContextWrapper[None], input_data: HandoffReason):
    log.info(f"Reason for handoff to {input_data.agent_name}: {input_data.reason}")


# Entrypoint agent that takes the user's input and attempts to create a SINGLE question
triager = Agent[AgentState](
    model=LLMType.GPT4O_MINI,
    model_settings=ModelSettings(
        temperature=0.0,
    ),
    name=AgentNames.TRIAGER,
    instructions=get_triager_system_prompt,
    # Handoffs invocation is OPTIONAL. Triager will not handoff to any agent if it does not believe it is necessary / suitable.
    handoffs=[
        handoff(
            agent=problem_generator,
            input_filter=handoff_filters.remove_all_tools,
            # on_handoff=lambda _: log.info(f"❓ Handoff to {AgentNames.PROBLEM_GENERATOR} ❓"),
            on_handoff=on_handoff,
            input_type=HandoffReason,
        ),
        handoff(
            agent=file_generator,
            input_filter=handoff_filters.remove_all_tools,
            # on_handoff=lambda _: log.info(f"📁 Handoff to {AgentNames.FILE_GENERATOR} 📁"),
            on_handoff=on_handoff,
            input_type=HandoffReason,
        ),
        handoff(
            agent=test_generator,
            input_filter=handoff_filters.remove_all_tools,
            # on_handoff=lambda _: log.info(f"🎯 Handoff to {AgentNames.TEST_GENERATOR} 🎯"),
            on_handoff=on_handoff,
            input_type=HandoffReason,
        ),
    ],
)
