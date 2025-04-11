import asyncio
import os
import tempfile
import uuid
from typing import Dict, List

import aiofiles

from app.models.file import File
from app.models.test_case import TestCase


class DockerRunner:
    """Utility class for running Python tests inside a Docker container"""

    async def create_temp_project(self, files: List[File]) -> str:
        """
        Create a temporary Python project directory structure

        Args:
            files: List of File objects containing code

        Returns:
            Path to the temporary directory
        """
        temp_dir = tempfile.mkdtemp(prefix="python_test_")

        # Create a basic project structure
        os.makedirs(f"{temp_dir}/src", exist_ok=True)
        os.makedirs(f"{temp_dir}/tests", exist_ok=True)

        # Write files to temp directory
        for file in files:
            # Determine the appropriate path based on the file name
            file_path = self._get_file_path(temp_dir, file.name)

            # Create subdirectories if needed
            os.makedirs(os.path.dirname(file_path), exist_ok=True)

            # Write the file
            async with aiofiles.open(file_path, "w") as f:
                await f.write(file.code)

        # Create a requirements.txt if not included in files
        if not any(file.name == "requirements.txt" for file in files):
            await self._create_default_requirements(temp_dir)

        # Create pytest configuration
        await self._create_pytest_config(temp_dir)

        return temp_dir

    def _get_file_path(self, base_dir: str, file_name: str) -> str:
        """Determine the appropriate file path based on naming conventions"""
        # Handle test files
        if file_name.startswith("test_") and file_name.endswith(".py"):
            if not ("/" in file_name or "\\" in file_name):
                return f"{base_dir}/tests/{file_name}"

        # For explicitly pathed files (containing '/' or '\')
        if "/" in file_name or "\\" in file_name:
            return f"{base_dir}/{file_name}"

        # For requirements.txt, place at root
        if file_name == "requirements.txt":
            return f"{base_dir}/{file_name}"

        # Default to src directory for Python files
        if file_name.endswith(".py"):
            return f"{base_dir}/src/{file_name}"

        # Other files go to root directory
        return f"{base_dir}/{file_name}"

    async def _create_default_requirements(self, dir_path: str) -> None:
        """Create a default requirements.txt with necessary dependencies"""
        requirements = """
pytest==7.4.0
pytest-xdist==3.3.1
"""
        async with aiofiles.open(f"{dir_path}/requirements.txt", "w") as f:
            await f.write(requirements)

    async def _create_pytest_config(self, dir_path: str) -> None:
        """Create pytest configuration files"""
        # Create pytest.ini
        pytest_ini = """
[pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
"""
        async with aiofiles.open(f"{dir_path}/pytest.ini", "w") as f:
            await f.write(pytest_ini)

        # Create conftest.py
        conftest = """
import sys
import os

# Add the src directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))
"""
        async with aiofiles.open(f"{dir_path}/conftest.py", "w") as f:
            await f.write(conftest)

        # Create __init__.py files to make the directories proper packages
        async with aiofiles.open(f"{dir_path}/src/__init__.py", "w") as f:
            await f.write("")

        async with aiofiles.open(f"{dir_path}/tests/__init__.py", "w") as f:
            await f.write("")

    async def generate_test_files(
        self, dir_path: str, test_cases: List[TestCase], files: List[File]
    ) -> None:
        """
        Generate test files from test cases

        Args:
            dir_path: Path to the temporary directory
            test_cases: List of TestCase objects
            files: List of File objects for reference
        """
        for i, test_case in enumerate(test_cases):
            # Parse the test case description into a pytest test
            # This is a simplified implementation assuming test_case.description contains the test code
            test_content = f"""
# Test ID: {test_case.id}
# Test Description: {test_case.description}

{test_case.description}
"""
            test_file_name = f"test_{i+1}_{uuid.uuid4().hex[:8]}.py"
            async with aiofiles.open(f"{dir_path}/tests/{test_file_name}", "w") as f:
                await f.write(test_content)

    async def run_docker_tests(self, dir_path: str) -> Dict:
        """
        Run tests in a Docker container

        Args:
            dir_path: Path to the temporary directory with project files

        Returns:
            Dictionary with test results
        """
        container_name = f"python_test_{uuid.uuid4().hex[:8]}"

        # Command to run tests in a Python Docker container
        docker_cmd = [
            "docker",
            "run",
            "--rm",
            "--name",
            container_name,
            "-v",
            f"{dir_path}:/app",
            "-w",
            "/app",
            "python:3.10-slim",
            "sh",
            "-c",
            "pip install -r requirements.txt && python -m pytest tests -v",
        ]

        # Run Docker container
        process = await asyncio.create_subprocess_exec(
            *docker_cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
        )

        # Capture output
        stdout, stderr = await process.communicate()

        # Process the output
        return {
            "success": process.returncode == 0,
            "stdout": stdout.decode() if stdout else "",
            "stderr": stderr.decode() if stderr else "",
            "exit_code": process.returncode,
        }

    async def cleanup(self, dir_path: str) -> None:
        """
        Clean up temporary files

        Args:
            dir_path: Path to the temporary directory to remove
        """
        # Recursive delete of the temporary directory and all its contents
        await asyncio.to_thread(self._rmdir_recursive, dir_path)

    def _rmdir_recursive(self, path: str) -> None:
        """Helper method to recursively delete a directory"""
        for root, dirs, files in os.walk(path, topdown=False):
            for file in files:
                os.remove(os.path.join(root, file))
            for dir in dirs:
                os.rmdir(os.path.join(root, dir))
        os.rmdir(path)
