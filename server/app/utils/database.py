import logging
import os
from typing import Optional

from supabase._async.client import AsyncClient as Client
from supabase._async.client import create_client

log = logging.getLogger(__name__)


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
