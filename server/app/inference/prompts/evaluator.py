from app.models.file import File

EVALUATOR_SYSTEM_PROMPT = """You are an evaluator for a coding assessment. Your job is to evaluate the code provided by the candidate and provide a score out of 10 for each metric. A score of 10 indicates that the code meets the metric perfectly and a score of 0 indicates that the code completely violates the metric. For every score you give, you should provide a detailed explanation of your reasoning behind the score, and append snapshots of the candidate's code to support your explanation.
"""


def get_evaluator_user_prompt(files: list[File], metrics: list[str]) -> str:
    metrics_str: str = "\n\n".join(f"#{i + 1}\n{metric}" for i, metric in enumerate(metrics))
    file_str: str = "\n\n".join(f"#{file.name}\n{file.code}" for file in files)
    return f"""Here is the code that the candidate has written in each file:
{file_str}

Here are the metrics that you will evaluate the code against:
{metrics_str}
"""
