from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.database import get_db
from app.models.user import User
from app.schemas.income import IncomeCreate, IncomeResponse, IncomeUpdate
from app.core.security import get_current_user
from app.services.income_service import get_user_incomes, create_new_income, update_income, delete_income

router = APIRouter(prefix="/income", tags=["Income"]) # Define router for income-related API routes

# Get all incomes for the current authenticated user
@router.get("/", response_model=List[IncomeResponse])
async def get_incomes(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await get_user_incomes(db, current_user.id)

# Create a new income entry for the current user
@router.post("/", response_model=IncomeResponse)
async def create_income(income_data: IncomeCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await create_new_income(db, income_data, current_user.id)

# Update an existing income entry by ID
@router.put("/{income_id}", response_model=IncomeResponse)
async def update_income_endpoint(income_id: str, income_data: IncomeUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await update_income(db, income_id, income_data, current_user.id)

# Delete an income entry by ID
@router.delete("/{income_id}", response_model=IncomeResponse)
async def delete_income_endpoint(income_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await delete_income(db, income_id, current_user.id)
