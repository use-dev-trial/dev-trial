from langchain_core.tools import BaseTool
from pydantic import BaseModel

from app.agents.constants import Tool


class GenerateFileToolInput(BaseModel):
    """Input for GenerateFileTool"""


class GenerateFileTool(BaseTool):
    """Tool for generating a file based on the current task."""

    name: str = Tool.GENERATE_FILE
    description: str = "Generates a file based on the current task."
    args_schema: type[BaseModel] = GenerateFileToolInput

    def _run(self) -> str:  # type: ignore
        raise RuntimeError("Synchronous GenerateFileTool not supported")

    async def _arun(self) -> str:
        print("Generating a file...")
        return "Generating a file..."
