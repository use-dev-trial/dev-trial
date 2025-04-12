from supabase._async.client import AsyncClient as Client

from app.models.database import Table
from app.models.grading import Metrics


class GradingService:
    async def upsert_metrics(self, client: Client, input: Metrics):
        await client.table(Table.METRICS).upsert(input.model_dump()).execute()
