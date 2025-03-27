from langchain_core.tools import BaseTool
from pydantic import BaseModel

from app.agents.constants import Tool


class GenerateProblemDescriptionToolInput(BaseModel):
    """Input for GenerateProblemDescriptionTool"""


class GenerateProblemDescriptionTool(BaseTool):
    """Tool for generating a problem description based on the current task."""

    name: str = Tool.GENERATE_PROBLEM_DESCRIPTION
    description: str = "Generates a problem description based on the current task."
    args_schema: type[BaseModel] = GenerateProblemDescriptionToolInput

    def _run(self) -> str:  # type: ignore
        raise RuntimeError("Synchronous GenerateProblemDescriptionTool not supported")

    async def _arun(self) -> str:
        print("Generating a problem description...")
        return "Generating a problem description..."
