from uuid import uuid4
from typing import List
from datetime import datetime, UTC
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.income import Income
from app.schemas.income import IncomeCreate, IncomeUpdate

# Fetch all income records for a specific user, sorted by date (most recent first)
async def get_user_incomes(db: AsyncSession, user_id: str) -> List[Income]:
    result = await db.execute(select(Income).where(Income.user_id == user_id).order_by(Income.date.desc()))
    return result.scalars().all()

# Create and store a new income record for a specific user
async def create_new_income(db: AsyncSession, income_data: IncomeCreate, user_id: str) -> Income:
    new_income = Income(
        id=str(uuid4()),
        user_id=user_id,
        category_name=income_data.category_name,
        amount=income_data.amount,
        date=income_data.date or datetime.now(UTC),
        description=income_data.description
    )
    db.add(new_income)
    await db.commit()
    await db.refresh(new_income)
    return new_income

# Update an existing income entry if it belongs to the authenticated user
async def update_income(db: AsyncSession, income_id: str, income_data: IncomeUpdate, user_id: str) -> Income:
    result = await db.execute(
        select(Income).where(Income.id == income_id, Income.user_id == user_id)
    )
    income_obj = result.scalars().first()
    if not income_obj:
        raise HTTPException(status_code=404, detail="Income not found")
    
    income_obj.category_name = income_data.category_name
    income_obj.amount = income_data.amount
    income_obj.date = income_data.date
    income_obj.description = income_data.description

    await db.commit()
    await db.refresh(income_obj)
    return income_obj

# Delete an income entry if it belongs to the authenticated user
async def delete_income(db: AsyncSession, income_id: str, user_id: str) -> Income:
    result = await db.execute(
        select(Income).where(Income.id == income_id, Income.user_id == user_id)
    )
    income_obj = result.scalars().first()
    if not income_obj:
        raise HTTPException(status_code=404, detail="Income not found")
    
    await db.delete(income_obj)
    await db.commit()
    return income_obj
