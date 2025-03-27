import logging

from langchain_core.messages import (
    AnyMessage,
    BaseMessage,
    SystemMessage,
)

from app.agents.state import AgentState
from app.utils.llm import LLMType

log = logging.getLogger(__name__)


def get_file_generator_system_prompt():
    return f"""You are a helpful AI assistant that generates files for a coding assessment.
"""


class FileGenerator:

    def __init__(self):
        self.llm = LLMType.GOOGLE.get_chat_model()
        self.system_prompt = get_file_generator_system_prompt()

    def invoke(self, state: AgentState):
        log.info("📁 Invoking FileGenerator 📁")
        messages: list[AnyMessage] = [SystemMessage(self.system_prompt)] + state["messages"]
        response: BaseMessage = self.llm.invoke(messages)
        return {
            "messages": [response],
        }

    __call__ = invoke
