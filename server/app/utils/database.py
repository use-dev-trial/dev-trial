import logging
import os
import uuid
from typing import Optional

from supabase._async.client import AsyncClient as Client
from supabase._async.client import create_client

log = logging.getLogger(__name__)


def is_valid_uuid(value):
    try:
        uuid.UUID(str(value))
        return True
    except ValueError:
        return False


class DatabaseManager:
    _instance: Optional["DatabaseManager"] = None
    client: Client = None  # type: ignore

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    async def _init(self):
        if self.client is not None:
            return

        try:
            supabase_url = os.environ["SUPABASE_URL"]
            supabase_key = os.environ["SUPABASE_SERVICE_KEY"]
            self.client = await create_client(supabase_url=supabase_url, supabase_key=supabase_key)
            log.info("Supabase client initialized.")
        except KeyError as e:
            log.error(f"Missing environment variable: {e}")
            raise
        except Exception as e:
            log.error(f"Error initializing Supabase client: {e}")
            raise

    @classmethod
    async def get_instance(cls) -> "DatabaseManager":
        if cls._instance is None:
            cls._instance = cls()

        await cls._instance._init()
        return cls._instance


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
