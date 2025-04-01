from uuid import uuid4
from datetime import datetime, UTC
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

# Retrieve all expenses for a specific user, ordered by most recent first
async def get_user_expenses(db: AsyncSession, user_id: str):
    result = await db.execute(select(Expense).where(Expense.user_id == user_id).order_by(Expense.date.desc()))
    return result.scalars().all()

# Create a new expense entry for the user
async def create_new_expense(db: AsyncSession, expense_data: ExpenseCreate, user_id: str):
    new_expense = Expense(
        id=str(uuid4()),
        user_id=user_id,
        category_name=expense_data.category_name,
        amount=expense_data.amount,
        date=expense_data.date or datetime.now(UTC),
        description=expense_data.description
    )
    db.add(new_expense)
    await db.commit()
    await db.refresh(new_expense)
    return new_expense

# Update an existing expense if it belongs to the user
async def update_expense(db: AsyncSession, expense_id: str, expense_data: ExpenseUpdate, user_id: str):
    result = await db.execute(
        select(Expense).where(Expense.id == expense_id, Expense.user_id == user_id)
    )
    expense_obj = result.scalars().first()
    if not expense_obj:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    expense_obj.category_name = expense_data.category_name
    expense_obj.amount = expense_data.amount
    expense_obj.date = expense_data.date
    expense_obj.description = expense_data.description

    await db.commit()
    await db.refresh(expense_obj)
    return expense_obj

# Delete an expense if it belongs to the user
async def delete_expense(db: AsyncSession, expense_id: str, user_id: str):
    result = await db.execute(
        select(Expense).where(Expense.id == expense_id, Expense.user_id == user_id)
    )
    expense_obj = result.scalars().first()
    if not expense_obj:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    await db.delete(expense_obj)
    await db.commit()
    return expense_obj
