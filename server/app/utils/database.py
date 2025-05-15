import logging
import os
import uuid

from supabase import AsyncClientOptions
from supabase._async.client import AsyncClient as Client
from supabase._async.client import create_client

log = logging.getLogger(__name__)


def is_valid_uuid(value):
    try:
        uuid.UUID(str(value))
        return True
    except ValueError:
        return False


async def db_client(
    token: str,
) -> Client:
    supabase_url = os.environ["SUPABASE_URL"]

    """
    Note that if we set ADMIN_ACCESS to true, there won't be an org_id associated with the db request, which might be a cause of problem when the entry requires org_id to be non-null.
    """

    # Development
    if os.environ.get("ADMIN_ACCESS") == "true":
        supabase_key = os.environ["SUPABASE_SERVICE_KEY"]
        return await create_client(
            supabase_url=supabase_url,
            supabase_key=supabase_key,
        )
    # Production

    else:
        supabase_key = os.environ["SUPABASE_ANON_KEY"]
        return await create_client(
            supabase_url=supabase_url,
            supabase_key=supabase_key,
            options=AsyncClientOptions(
                headers={
                    "Authorization": f"Bearer {token}",
                    "apiKey": supabase_key,
                }
            ),
        )


"""
### RULES IMPLEMENTED IN POSTGRES ###

## Reject uuid inserts

CREATE OR REPLACE FUNCTION reject_uuid_insert()
RETURNS TRIGGER AS $$
BEGIN
  NEW.id := gen_random_uuid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_challenges
BEFORE INSERT ON challenges
FOR EACH ROW
EXECUTE FUNCTION reject_uuid_insert();

CREATE TRIGGER before_insert_files
BEFORE INSERT ON files
FOR EACH ROW
EXECUTE FUNCTION reject_uuid_insert();

CREATE TRIGGER before_insert_messages
BEFORE INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION reject_uuid_insert();

CREATE TRIGGER before_insert_problems
BEFORE INSERT ON problems
FOR EACH ROW
EXECUTE FUNCTION reject_uuid_insert();

CREATE TRIGGER before_insert_questions
BEFORE INSERT ON questions
FOR EACH ROW
EXECUTE FUNCTION reject_uuid_insert();
"""
