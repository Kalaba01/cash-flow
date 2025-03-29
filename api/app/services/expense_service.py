from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import uuid4
from datetime import datetime
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate

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
