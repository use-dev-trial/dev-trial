from langgraph.graph import END, START, StateGraph

from app.agents.constants import Node
from app.agents.nodes.file_generator import FileGenerator
from app.agents.nodes.problem_generator import ProblemDescriptionGenerator
from app.agents.nodes.test_generator import TestGenerator
from app.agents.nodes.triager import (
    GenerateFileTool,
    Triager,
)
from app.agents.state import AgentState
from app.agents.tools.triager.generate_problem_description import GenerateProblemDescriptionTool
from app.agents.tools.triager.generate_test import GenerateTestTool


def build_graph():
    graph_builder = StateGraph(AgentState)

    # Add Nodes
    graph_builder.add_node(Node.TRIAGER, Triager())
    graph_builder.add_node(Node.FILE_GENERATOR, FileGenerator())
    graph_builder.add_node(Node.PROBLEM_DESCRIPTION_GENERATOR, ProblemDescriptionGenerator())
    graph_builder.add_node(Node.TEST_GENERATOR, TestGenerator())

    # Add Edges
    graph_builder.add_edge(START, Node.TRIAGER)
    graph_builder.add_conditional_edges(Node.TRIAGER, _route_triager)
    graph_builder.add_edge(Node.FILE_GENERATOR, END)
    graph_builder.add_edge(Node.PROBLEM_DESCRIPTION_GENERATOR, END)
    graph_builder.add_edge(Node.TEST_GENERATOR, END)
    graph = graph_builder.compile()
    return graph


def _route_triager(state: AgentState):
    tool_choice = state.get("tool_choice")
    print("TOOL CHOICE")
    print(tool_choice)
    if tool_choice == GenerateFileTool.model_fields["name"].default:
        return Node.FILE_GENERATOR
    elif tool_choice == GenerateProblemDescriptionTool.model_fields["name"].default:
        return Node.PROBLEM_DESCRIPTION_GENERATOR
    elif tool_choice == GenerateTestTool.model_fields["name"].default:
        return Node.TEST_GENERATOR
    else:
        return END
