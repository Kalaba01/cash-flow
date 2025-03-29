from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.income import Income
from app.schemas.income import IncomeCreate
from uuid import uuid4
from datetime import datetime
from typing import List

async def get_user_incomes(db: AsyncSession, user_id: str) -> List[Income]:
    result = await db.execute(select(Income).where(Income.user_id == user_id).order_by(Income.date.desc()))
    return result.scalars().all()

async def create_new_income(db: AsyncSession, income_data: IncomeCreate, user_id: str) -> Income:
    new_income = Income(
        id=str(uuid4()),
        user_id=user_id,
        category_name=income_data.category_name,
        amount=income_data.amount,
        date=income_data.date or datetime.utcnow(),
        description=income_data.description
    )
    db.add(new_income)
    await db.commit()
    await db.refresh(new_income)
    return new_income
