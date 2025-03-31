from uuid import uuid4
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

async def get_user_expenses(db: AsyncSession, user_id: str):
    result = await db.execute(select(Expense).where(Expense.user_id == user_id).order_by(Expense.date.desc()))
    return result.scalars().all()

async def create_new_expense(db: AsyncSession, expense_data: ExpenseCreate, user_id: str):
    new_expense = Expense(
        id=str(uuid4()),
        user_id=user_id,
        category_name=expense_data.category_name,
        amount=expense_data.amount,
        date=expense_data.date or datetime.utcnow(),
        description=expense_data.description
    )
    db.add(new_expense)
    await db.commit()
    await db.refresh(new_expense)
    return new_expense

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
