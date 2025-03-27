from langchain_openai import ChatOpenAI

from app.agents.state import AgentState

test_generator_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)


def test_generator(state: AgentState):
    return {"messages": [test_generator_llm.invoke(state["messages"])]}
