from supabase._async.client import AsyncClient as Client

from app.models.database import Table
from app.models.grading import Metric


class GradingService:
    async def upsert_metric(self, client: Client, input: Metric):
        if input.id:
            await client.table(Table.METRICS).update(
                {
                    "question_id": input.question_id,
                    "content": input.content,
                }
            ).eq("id", input.id).execute()
        else:
            await client.table(Table.METRICS).insert(
                {
                    "question_id": input.question_id,
                    "content": input.content,
                }
            ).execute()
