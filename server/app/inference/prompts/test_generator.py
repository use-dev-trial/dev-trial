from agents import Agent, RunContextWrapper

from app.inference.state import AgentState


def get_test_generator_system_prompt(
    context: RunContextWrapper[AgentState], agent: Agent[AgentState]
) -> str:
    question_dump: str = (
        context.context.question.model_dump_json() if context.context.question else ""
    )

    return f"""You are a helpful AI assistant that generates test cases for a coding assessment.

Here is the constructed question so far:
{question_dump}
"""
