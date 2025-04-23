from pydantic import BaseModel, Field


class File(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    name: str = Field(description="The name of the file including the file extension.")
    code: str = Field(
        description="The code present in the file. It might be fully complete, partially complete, or empty (depending on the purpose of the file in the overall question)."
    )
    path: list[str] = Field(
        description="The path of the file in the file system. Each directory level is represented by a separate string in the list."
    )
