from langchain_core.tools import BaseTool
from pydantic import BaseModel

from app.agents.constants import Tool


class GenerateProblemToolInput(BaseModel):
    """Input for GenerateProblemTool"""


class GenerateProblemTool(BaseTool):
    """Tool for generating a problem description based on the current task."""

    name: str = Tool.GENERATE_PROBLEM
    description: str = "Generates a problem description based on the current task."
    args_schema: type[BaseModel] = GenerateProblemToolInput

    def _run(self) -> str:  # type: ignore
        raise RuntimeError("Synchronous GenerateProblemTool not supported")

    async def _arun(self) -> str:
        return "Generating a problem description..."
