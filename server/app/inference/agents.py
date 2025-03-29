import logging

from agents import Agent, ModelSettings, handoff
from agents.extensions import handoff_filters

from app.inference.constants import AgentNames
from app.inference.prompts.file_generator import FILE_GENERATOR_SYSTEM_PROMPT
from app.inference.prompts.question_generator import PROBLEM_GENERATOR_SYSTEM_PROMPT
from app.inference.prompts.test_generator import TEST_GENERATOR_SYSTEM_PROMPT
from app.inference.prompts.triager import TRIAGER_SYSTEM_PROMPT
from app.inference.state import AgentState
from app.models.question import Files, Problem, TestCases
from app.utils.llm import LLMType

log = logging.getLogger(__name__)

file_generator = Agent[AgentState](
    model=LLMType.GPT4O_MINI,
    model_settings=ModelSettings(
        temperature=0.0,
    ),
    name=AgentNames.FILE_GENERATOR,
    instructions=FILE_GENERATOR_SYSTEM_PROMPT,
    output_type=Files,
)

problem_generator = Agent[AgentState](
    model=LLMType.GPT4O_MINI,
    model_settings=ModelSettings(
        temperature=0.0,
    ),
    name=AgentNames.PROBLEM_GENERATOR,
    instructions=PROBLEM_GENERATOR_SYSTEM_PROMPT,
    output_type=Problem,
)

test_generator = Agent[AgentState](
    model=LLMType.GPT4O_MINI,
    model_settings=ModelSettings(
        temperature=0.0,
    ),
    name=AgentNames.TEST_GENERATOR,
    instructions=TEST_GENERATOR_SYSTEM_PROMPT,
    output_type=TestCases,
)

# Entrypoint agent that takes the user's input and attempts to create a SINGLE question
triager = Agent[AgentState](
    model=LLMType.GPT4O_MINI,
    model_settings=ModelSettings(
        temperature=0.0,
    ),
    name=AgentNames.TRIAGER,
    instructions=TRIAGER_SYSTEM_PROMPT,
    handoffs=[
        handoff(
            agent=problem_generator,
            input_filter=handoff_filters.remove_all_tools,
            on_handoff=lambda _: log.info(f"❓ Handoff to {AgentNames.PROBLEM_GENERATOR} ❓"),
        ),
        handoff(
            agent=file_generator,
            input_filter=handoff_filters.remove_all_tools,
            on_handoff=lambda _: log.info(f"📁 Handoff to {AgentNames.FILE_GENERATOR} 📁"),
        ),
        handoff(
            agent=test_generator,
            input_filter=handoff_filters.remove_all_tools,
            on_handoff=lambda _: log.info(f"🎯 Handoff to {AgentNames.TEST_GENERATOR} 🎯"),
        ),
    ],
)


# https://github.com/openai/openai-agents-python/blob/main/examples/agent_patterns/agents_as_tools.py
synthesizer_agent = Agent(
    name=AgentNames.SYNTHESIZER,
    instructions="You inspect translations, correct them if needed, and produce a final concatenated response.",
)
