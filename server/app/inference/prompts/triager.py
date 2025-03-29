from agents import Agent, RunContextWrapper
from agents.extensions.handoff_prompt import prompt_with_handoff_instructions

from app.inference.constants import AgentNames
from app.inference.state import AgentState


def get_triager_system_prompt(
    context: RunContextWrapper[AgentState], agent: Agent[AgentState]
) -> str:
    # return f"The user's name is {context.context.name}. Help them with their questions."

    question_dump: str = (
        context.context.question.model_dump_json() if context.context.question else ""
    )

    return prompt_with_handoff_instructions(
        f"""You are a helpful AI assistant that triages what's the next step to take. Your overall goal is to assist the user in generating a coding assessment. Based on the user's instruction and the current state of question construction, handoff to one of the following agents:

    - {AgentNames.PROBLEM_GENERATOR}: Generates/Modifies the problem description based on the user's instruction.
    - {AgentNames.FILE_GENERATOR}: Generates/Modifies a file that is visible/editable by the candidate.
    - {AgentNames.TEST_GENERATOR}: Generates/Modifies a test case that the candidate can run to verify the solution.

If the user's instruction is not clear or you need user input/clarification on how to proceed, do not handoff to any agent and ask your clarifying question instead. If you believe that the current state of question construction is suitable for user feedback, DO NOT handoff to any agent and ask the user for feedback instead. Handing off to the same agent repeatedly is generally a mistake.
    
Here is the constructed question so far:
{question_dump}"""
    )
