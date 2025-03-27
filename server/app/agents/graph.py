from langgraph.graph import END, START, StateGraph

from app.agents.constants import Node
from app.agents.nodes.file_generator import file_generator
from app.agents.nodes.problem_generator import problem_generator
from app.agents.nodes.test_generator import test_generator
from app.agents.nodes.triager import (
    GenerateFileTool,
    Triager,
)
from app.agents.state import AgentState
from app.agents.tools.triager.generate_problem import GenerateProblemTool
from app.agents.tools.triager.generate_test import GenerateTestTool


def build_graph():
    graph_builder = StateGraph(AgentState)

    # Add Nodes
    graph_builder.add_node(Node.TRIAGER, Triager())
    graph_builder.add_node(Node.FILE_GENERATOR, file_generator)
    graph_builder.add_node(Node.PROBLEM_GENERATOR, problem_generator)
    graph_builder.add_node(Node.TEST_GENERATOR, test_generator)

    # Add Edges
    graph_builder.add_edge(START, Node.TRIAGER)
    graph_builder.add_conditional_edges(Node.TRIAGER, _route_triager)
    graph_builder.add_edge(Node.FILE_GENERATOR, END)
    graph_builder.add_edge(Node.PROBLEM_GENERATOR, END)
    graph_builder.add_edge(Node.TEST_GENERATOR, END)
    graph = graph_builder.compile()
    return graph


def _route_triager(state: AgentState):
    tool_choice = state.get("tool_choice")
    if tool_choice == GenerateFileTool.model_fields["name"].default:
        return Node.FILE_GENERATOR
    elif tool_choice == GenerateProblemTool.model_fields["name"].default:
        return Node.PROBLEM_GENERATOR
    elif tool_choice == GenerateTestTool.model_fields["name"].default:
        return Node.TEST_GENERATOR
    else:
        return END
