import asyncio
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import delete

from .database import Base, SessionLocal, engine
from .models import Message
from .routers import auth, messages, projects

load_dotenv()

Base.metadata.create_all(bind=engine)

logger = logging.getLogger(__name__)
MESSAGE_RETENTION = timedelta(days=30)
MESSAGE_CLEANUP_INTERVAL = timedelta(days=1).total_seconds()


def purge_expired_messages() -> int:
    cutoff = datetime.now(timezone.utc).replace(tzinfo=None) - MESSAGE_RETENTION
    with SessionLocal() as db:
        result = db.execute(delete(Message).where(Message.created_at < cutoff))
        db.commit()
        return result.rowcount or 0


async def cleanup_expired_messages_periodically() -> None:
    while True:
        try:
            deleted_count = await asyncio.to_thread(purge_expired_messages)
            if deleted_count:
                logger.info("Suppression de %s message(s) expiré(s)", deleted_count)
        except Exception:
            logger.exception("Échec de la suppression des messages expirés")
        await asyncio.sleep(MESSAGE_CLEANUP_INTERVAL)


@asynccontextmanager
async def lifespan(_: FastAPI):
    cleanup_task = asyncio.create_task(cleanup_expired_messages_periodically())
    try:
        yield
    finally:
        cleanup_task.cancel()
        await asyncio.gather(cleanup_task, return_exceptions=True)


app = FastAPI(title="DevMarket API", lifespan=lifespan)

origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:4200").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Path("uploads").mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(messages.router)


@app.get("/")
def root():
    return {"status": "ok", "docs": "/docs"}
