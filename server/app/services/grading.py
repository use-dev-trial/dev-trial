from supabase._async.client import AsyncClient as Client

from app.models.database import Table
from app.models.grading import Metric


class GradingService:
    async def upsert_metric(self, client: Client, input: Metric):
        await client.table(Table.METRICS).upsert(input.model_dump()).execute()
