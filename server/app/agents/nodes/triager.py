import logging

from langchain_core.messages import (
    AnyMessage,
    BaseMessage,
    SystemMessage,
)

from app.agents.state import AgentState
from app.agents.tools.triager.generate_file import GenerateFileTool
from app.agents.tools.triager.generate_problem import GenerateProblemTool
from app.agents.tools.triager.generate_test import GenerateTestTool
from app.utils.llm import LLMType, postprocess_tool_message

log = logging.getLogger(__name__)


def get_triager_system_prompt():
    return f"""You are a helpful AI assistant that triages what's the next step to take. Your overall goal is to assist the user in generating a coding assessment. Based on the user's instruction and the current state of task completion, invoke one of the the following tools:

- {GenerateProblemTool.model_fields["name"].default}: Generates/Modifies the problem description based on the user's instruction.
- {GenerateFileTool.model_fields["name"].default}: Generates/Modifies a file that is visible/editable by the candidate.
- {GenerateTestTool.model_fields["name"].default}: Generates/Modifies a test case that the candidate can run to verify the solution.

If the user's instruction is not clear or you need user input/clarification on how to proceed, do not invoke any tool and ask your clarifying question instead. 
"""


class Triager:

    def __init__(self):
        self.llm = LLMType.GOOGLE.get_chat_model(
            tools=[GenerateFileTool(), GenerateProblemTool(), GenerateTestTool()]
        )
        self.system_prompt = get_triager_system_prompt()

    def invoke(self, state: AgentState):
        messages: list[AnyMessage] = [SystemMessage(self.system_prompt)] + state["messages"]
        response: BaseMessage = self.llm.invoke(messages)
        response = postprocess_tool_message(msg=response)
        print("TRIAGER RESPONSE:")
        print(response)
        return {
            "messages": [response],
        }

    __call__ = invoke
