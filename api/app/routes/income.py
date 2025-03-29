from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.database import get_db
from app.models.user import User
from app.schemas.income import IncomeCreate, IncomeResponse
from app.core.security import get_current_user
from app.services.income_service import get_user_incomes, create_new_income

router = APIRouter(prefix="/income", tags=["Income"])

@router.get("/", response_model=List[IncomeResponse])
async def get_incomes(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await get_user_incomes(db, current_user.id)

@router.post("/", response_model=IncomeResponse)
async def create_income(income_data: IncomeCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await create_new_income(db, income_data, current_user.id)
