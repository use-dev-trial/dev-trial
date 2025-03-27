from langchain_openai import ChatOpenAI

from app.agents.state import AgentState

problem_generator_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)


def problem_generator(state: AgentState):
    print("PROBLEM GENERATOR STATE:")
    print(state)
    return {"messages": [problem_generator_llm.invoke(state["messages"])]}
