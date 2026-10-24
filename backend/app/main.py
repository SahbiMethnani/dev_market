import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import Base, engine
from .routers import auth, messages, projects

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DevMarket API")

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
