from supabase._async.client import AsyncClient as Client

from app.models.database import Table
from app.models.metric import UpsertMetricRequest, UpsertMetricResponse


class MetricsService:
    async def upsert_metric(
        self, input: UpsertMetricRequest, client: Client
    ) -> UpsertMetricResponse:
        question_id: str = input.question_id
        if input.id:
            upsert_metric_result = (
                await client.table(Table.METRICS)
                .update(
                    {
                        "content": input.content,
                    }
                )
                .eq("id", input.id)
                .execute()
            )
        else:  # id will be empty string if its a fresh metric
            # Create a new entry in the metrics table
            upsert_metric_result = (
                await client.table(Table.METRICS)
                .insert(
                    {
                        "content": input.content,
                    }
                )
                .execute()
            )
            if not question_id:  # Empty string indicates that the question is not created yet
                question_result = await client.table(Table.QUESTIONS).insert({}).execute()
                question_id = question_result.data[0]["id"]
            await client.table(Table.QUESTION_METRIC).insert(
                {
                    "question_id": question_id,
                    "metric_id": upsert_metric_result.data[0]["id"],
                }
            ).execute()
        return UpsertMetricResponse(
            question_id=question_id,
            id=upsert_metric_result.data[0]["id"],
            content=upsert_metric_result.data[0]["content"],
        )
