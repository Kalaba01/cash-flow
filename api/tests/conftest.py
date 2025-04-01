import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
import pytest_asyncio
import asyncio
import httpx
from httpx import ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.db.database import get_db, Base
from app.main import app
from app.models.user import User
from app.core.security import get_current_user

DATABASE_URL = "sqlite+aiosqlite:///:memory:" # Configure in-memory SQLite database for testing

# Create async SQLAlchemy engine with StaticPool for SQLite in-memory testing
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False) # Define test session factory

# Override default get_db dependency to use test session
async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

# Override get_current_user to return a mock user for authenticated routes
async def override_get_current_user():
    return User(
        id="test-user-id",
        email="test@example.com",
        first_name="Test",
        last_name="User"
    )

app.dependency_overrides[get_current_user] = override_get_current_user # Apply override to FastAPI app for current user dependency

# Fixture to create and tear down test database schema per test function
@pytest_asyncio.fixture(scope="function")
async def test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with TestingSessionLocal() as session:
        yield session
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

app.dependency_overrides[get_db] = override_get_db  # Apply override to FastAPI app for database session dependency

# Fixture to create HTTPX async client for testing FastAPI app
@pytest_asyncio.fixture(scope="function")
async def async_client():
    transport = ASGITransport(app=app, raise_app_exceptions=True)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
