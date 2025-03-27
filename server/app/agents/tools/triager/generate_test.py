from langchain_core.tools import BaseTool
from pydantic import BaseModel

from app.agents.constants import Tool


class GenerateTestToolInput(BaseModel):
    """Input for GenerateTestTool"""


class GenerateTestTool(BaseTool):
    """Tool for generating a test case based on the current task."""

    name: str = Tool.GENERATE_TEST
    description: str = "Generates a test case based on the current task."
    args_schema: type[BaseModel] = GenerateTestToolInput

    def _run(self) -> str:  # type: ignore
        raise RuntimeError("Synchronous GenerateTestTool not supported")

    async def _arun(self) -> str:
        print("Generating a test case...")
        return "Generating a test case..."
