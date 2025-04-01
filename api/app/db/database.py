import os
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

load_dotenv() # Load environment variables from .env file

DATABASE_URL = os.getenv("DATABASE_URL") # Retrieve the database URL from environment variables

# Raise an error if the DATABASE_URL is missing
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not valid!")

engine = create_async_engine(DATABASE_URL, echo=True, future=True) # Create an asynchronous SQLAlchemy engine
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False) # Configure sessionmaker to create async sessions
Base = declarative_base() # Base class for SQLAlchemy models

# Dependency to get a database session in FastAPI routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
