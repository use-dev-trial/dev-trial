from langchain_openai import ChatOpenAI

from app.agents.state import AgentState

file_generator_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)


def file_generator(state: AgentState):
    return {"messages": [file_generator_llm.invoke(state["messages"])]}
