from langgraph.graph import MessagesState

from app.agents.constants import Tool


class AgentState(MessagesState):
    tool_choice: Tool
