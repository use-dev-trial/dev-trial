from enum import StrEnum


class AgentNames(StrEnum):
    TRIAGER = "Triager"
    FILE_GENERATOR = "FileGenerator"
    PROBLEM_GENERATOR = "ProblemGenerator"
    TEST_GENERATOR = "TestGenerator"
    SYNTHESIZER = "Synthesizer"
    EVALUATOR = "Evaluator"
