from pydantic import BaseModel, Field

from app.models.database import DatabaseObjectMixin


class File(BaseModel):
    id: str = Field(description="The ID of the question as it is stored in the database.")
    name: str = Field(description="The name of the file including the file extension.")
    code: str = Field(
        description="The code present in the file. It might be fully complete, partially complete, or empty (depending on the purpose of the file in the overall question)."
    )


class FileDB(File, DatabaseObjectMixin):
    pass
