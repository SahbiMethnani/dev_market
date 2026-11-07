import os
import ssl
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import StaticPool

load_dotenv()


def _normalize_database_url(url: str) -> str:
    if url.startswith("mysql://"):
        return url.replace("mysql://", "mysql+pymysql://", 1)
    return url


def _engine_options(url: str, require_ssl: bool) -> dict:
    options: dict = {"pool_pre_ping": True}
    if url.startswith("sqlite"):
        options["connect_args"] = {"check_same_thread": False}
        if ":memory:" in url:
            options["poolclass"] = StaticPool
    elif require_ssl:
        options["connect_args"] = {"ssl": ssl.create_default_context()}
    return options


DATABASE_URL = os.getenv(
    "DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/devmarket"
)

DATABASE_URL = _normalize_database_url(
    os.getenv("CONNECTION_STRING") or DATABASE_URL
)

_require_database_ssl = os.getenv("DB_SSL", "").strip().lower() in {
    "1",
    "true",
    "yes",
}
engine = create_engine(
    DATABASE_URL,
    **_engine_options(DATABASE_URL, _require_database_ssl),
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
