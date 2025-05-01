from supabase._async.client import AsyncClient as Client

from app.models.database import Table
from app.models.file import UpsertFileRequest, UpsertFileResponse


class FilesService:
    async def upsert_file(self, input: UpsertFileRequest, client: Client) -> UpsertFileResponse:
        question_id: str = input.question_id
        if input.id:
            upsert_file_result = (
                await client.table(Table.FILES)
                .update(
                    {
                        "name": input.name,
                        "code": input.code,
                        "path": input.path,
                    }
                )
                .eq("id", input.id)
                .execute()
            )
        else:  # id will be empty string if its a fresh file
            if not question_id:  # Empty string indicates that the question is not created yet
                question_result = await client.table(Table.QUESTIONS).insert({}).execute()
                question_id = question_result.data[0]["id"]
            # Create a new entry in the files table
            upsert_file_result = (
                await client.table(Table.FILES)
                .insert(
                    {
                        "name": input.name,
                        "code": input.code,
                        "path": input.path,
                    }
                )
                .execute()
            )
            await client.table(Table.QUESTION_FILE).insert(
                {
                    "question_id": question_id,
                    "file_id": upsert_file_result.data[0]["id"],
                }
            ).execute()

        return UpsertFileResponse(
            id=upsert_file_result.data[0]["id"],
            name=upsert_file_result.data[0]["name"],
            code=upsert_file_result.data[0]["code"],
            path=upsert_file_result.data[0]["path"],
            question_id=question_id,
        )
