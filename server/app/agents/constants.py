from enum import StrEnum


class Node(StrEnum):
    TRIAGER = "Triager"
    FILE_GENERATOR = "FileGenerator"
    PROBLEM_GENERATOR = "ProblemGenerator"
    TEST_GENERATOR = "TestGenerator"


class Tool(StrEnum):
    GENERATE_FILE = "GenerateFile"
    GENERATE_PROBLEM = "GenerateProblem"
    GENERATE_TEST = "GenerateTest"
