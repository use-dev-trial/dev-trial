import re
from typing import Dict, List

from app.models.test_case import TestCase


class PytestTestParser:
    """Parser for pytest test output"""

    def parse_results(self, stdout: str, stderr: str, test_cases: List[TestCase]) -> List[Dict]:
        """
        Parse pytest test output and match with test cases

        Args:
            stdout: Standard output from pytest
            stderr: Standard error from pytest
            test_cases: List of test cases to match against

        Returns:
            List of parsed test results
        """
        results = []

        # Check if we have actual output to parse
        if not stdout and not stderr:
            # No output to parse, all tests are considered failed
            for test_case in test_cases:
                results.append(
                    {
                        "test_case_id": test_case.id,
                        "description": test_case.description,
                        "passed": False,
                        "error": "No test output",
                    }
                )
            return results

        # Extract test results from pytest output
        test_results = self._extract_test_results(stdout)

        # Match test results with test cases
        for test_case in test_cases:
            test_id_marker = f"Test ID: {test_case.id}"
            matched_result = None

            # Look for test case ID in the results
            for test_path, test_result in test_results.items():
                if test_id_marker in test_result.get("details", ""):
                    matched_result = test_result
                    break

            if matched_result:
                result = {
                    "test_case_id": test_case.id,
                    "description": test_case.description,
                    "passed": matched_result["status"] == "passed",
                }

                if matched_result["status"] != "passed" and matched_result.get("error"):
                    result["error"] = matched_result["error"]

                results.append(result)
            else:
                # Test not found in output
                results.append(
                    {
                        "test_case_id": test_case.id,
                        "description": test_case.description,
                        "passed": False,
                        "error": "Test not executed",
                    }
                )

        return results

    def _extract_test_results(self, output: str) -> Dict[str, Dict]:
        """
        Extract test results from pytest output

        Args:
            output: The full pytest output

        Returns:
            Dictionary mapping test paths to their results
        """
        results = {}
        current_test = None
        current_details = []
        collecting_error = False
        error_lines = []

        # Split by lines and process
        for line in output.split("\n"):
            # Look for test result lines
            if re.match(r"tests/test_.*\.py::.*", line):
                # New test found, save previous if any
                if current_test:
                    results[current_test]["details"] = "\n".join(current_details)
                    if collecting_error:
                        results[current_test]["error"] = "\n".join(error_lines)

                # Extract test path and status
                test_path = line.split(" ")[0].strip()
                status = "passed"

                if "FAILED" in line:
                    status = "failed"
                elif "ERROR" in line:
                    status = "error"
                elif "SKIPPED" in line:
                    status = "skipped"

                current_test = test_path
                current_details = [line]
                collecting_error = False
                error_lines = []

                results[current_test] = {"status": status, "details": ""}
            elif line.startswith("E ") and current_test:
                # Error line
                collecting_error = True
                error_lines.append(line[2:])  # Remove the "E " prefix
                current_details.append(line)
            elif current_test:
                # Additional details for the current test
                current_details.append(line)

        # Save the last test details if any
        if current_test:
            results[current_test]["details"] = "\n".join(current_details)
            if collecting_error:
                results[current_test]["error"] = "\n".join(error_lines)

        return results
