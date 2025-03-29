from agents import Agent, RunContextWrapper

from app.inference.state import AgentState


def get_problem_generator_system_prompt(
    context: RunContextWrapper[AgentState], agent: Agent[AgentState]
) -> str:
    question_dump: str = (
        context.context.question.model_dump_json() if context.context.question else ""
    )

    return f"""You are a helpful AI assistant that generates problem descriptions for a coding assessment. Based on the user's request and the current state of question construction, you will need to EITHER generate a new problem description OR modify the existing one.

Here is the constructed question so far:
{question_dump}
"""
