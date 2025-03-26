from fastapi import FastAPI
from app.db.database import engine, Base
from app.routes.auth import router as auth_router

app = FastAPI()

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "FastAPI with PostgreSQL is running!"}
