from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.routes.auth import router as auth_router
from app.routes.profile import router as profile_router
from app.routes.income import router as income_router
from app.routes.expense import router as expense_router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(income_router)
app.include_router(expense_router)

@app.get("/")
def read_root():
    return {"message": "FastAPI with PostgreSQL is running!"}
