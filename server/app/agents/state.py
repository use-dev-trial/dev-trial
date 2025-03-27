from typing import Optional

from langchain.schema import AgentAction
from langgraph.graph import MessagesState


class AgentState(MessagesState):
    tool_choice: Optional[str]
    tool_input: Optional[dict]
    intermediate_steps: list[tuple[AgentAction, str]]
