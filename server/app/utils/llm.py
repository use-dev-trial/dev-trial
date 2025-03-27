from enum import StrEnum
from typing import Literal, Optional

from langchain_anthropic import ChatAnthropic
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage, BaseMessage
from langchain_core.tools import BaseTool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI


class LLMType(StrEnum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"

    def get_chat_model(self, tools: Optional[list[BaseTool]] = None):
        chat_model: BaseChatModel = None  # type: ignore
        match self:
            case LLMType.OPENAI:
                chat_model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
            case LLMType.ANTHROPIC:
                chat_model = ChatAnthropic(model="claude-3-5-haiku-latest", temperature=0, max_tokens=500)  # type: ignore
            case LLMType.GOOGLE:
                chat_model = ChatGoogleGenerativeAI(model="gemini-2.5-pro-exp-03-25", temperature=0)
            case _:
                raise ValueError(f"LLM type {self} not supported.")
        if tools is not None:
            llm_with_tools = chat_model.bind_tools(
                tools=tools, tool_choice=self.get_tool_calling_method()
            )
            return llm_with_tools
        return chat_model

    def get_tool_calling_method(self) -> Literal["any", "required"]:
        match self:
            case LLMType.OPENAI:
                return "required"
            case LLMType.ANTHROPIC | LLMType.GOOGLE:
                return "any"
            case _:
                raise ValueError(f"LLM type {self} not supported.")


def postprocess_tool_message(msg: BaseMessage) -> AIMessage:
    """Post-processes the AIMessage returned by the LLM to preserve only the first tool call for the next turn."""
    processed_result = msg.model_copy()
    if isinstance(processed_result, AIMessage):
        processed_result.tool_calls = processed_result.tool_calls[:1]
    if (
        hasattr(processed_result, "additional_kwargs")
        and "tool_calls" in processed_result.additional_kwargs
    ):
        processed_result.additional_kwargs["tool_calls"] = processed_result.additional_kwargs[
            "tool_calls"
        ][:1]
    return processed_result  # type: ignore
