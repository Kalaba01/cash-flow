from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.database import get_db
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from app.core.security import get_current_user
from app.services.expense_service import get_user_expenses, create_new_expense

router = APIRouter(prefix="/expense", tags=["Expense"])

@router.get("/", response_model=List[ExpenseResponse])
async def get_expenses(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await get_user_expenses(db, current_user.id)

@router.post("/", response_model=ExpenseResponse)
async def create_expense(expense_data: ExpenseCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await create_new_expense(db, expense_data, current_user.id)
