from enum import StrEnum


class Node(StrEnum):
    TRIAGER = "Triager"
    FILE_GENERATOR = "FileGenerator"
    PROBLEM_DESCRIPTION_GENERATOR = "ProblemDescriptionGenerator"
    TEST_GENERATOR = "TestGenerator"


class Tool(StrEnum):
    GENERATE_FILE = "GenerateFile"
    GENERATE_PROBLEM_DESCRIPTION = "GenerateProblemDescription"
    GENERATE_TEST = "GenerateTest"
