from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.routes.auth import router as auth_router
from app.routes.profile import router as profile_router
from app.routes.income import router as income_router
from app.routes.expense import router as expense_router
from app.routes.goal import router as goal_router
from contextlib import asynccontextmanager

# Create database tables on application startup using lifespan context
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan) # Initialize FastAPI application with custom lifespan

# Enable CORS for frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include routes
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(income_router)
app.include_router(expense_router)
app.include_router(goal_router)
