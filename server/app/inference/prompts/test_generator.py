from agents import Agent, RunContextWrapper

from app.inference.state import AgentState


def get_test_generator_system_prompt(
    context: RunContextWrapper[AgentState], agent: Agent[AgentState]
) -> str:
    question_dump: str = (
        context.context.question.model_dump_json() if context.context.question else ""
    )

    return f"""You are a helpful AI assistant that generates test cases for a coding assessment. Based on the user's request and the current state of question construction, you will need to EITHER generate a new test case OR modify one of the existing ones. When generating a new test case, there is no need to generate the id of the test case (just leave it as an empty string). When modifying an existing test case, you must provide the EXACT id of the test case you are modifying.


Here is the constructed question so far:
{question_dump}
"""
