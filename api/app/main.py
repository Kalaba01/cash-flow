from fastapi import FastAPI
from app.db.database import engine
from app.models.models import Base

app = FastAPI()

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def read_root():
    return {"message": "FastAPI with PostgreSQL is running!"}
