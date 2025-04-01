from uuid import uuid4
from typing import List
from fastapi import HTTPException
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import aliased
from sqlalchemy.orm import selectinload
from app.models.income import Income
from app.models.expense import Expense
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse

async def calculate_current_amount(db: AsyncSession, category_name: str, goal_type: str, user_id: str, period: str) -> float:
    model = Income if goal_type == "income" else Expense
    now = datetime.now()

    start_date = None
    if period == "week":
        start_date = now - timedelta(days=7)
    elif period == "month":
        start_date = now.replace(day=1)
    elif period == "year":
        start_date = now.replace(month=1, day=1)

    query = select(model).where(
        model.user_id == user_id,
        model.category_name == category_name
    )

    if start_date:
        query = query.where(model.date >= start_date)

    result = await db.execute(query)
    transactions = result.scalars().all()

    return sum(t.amount for t in transactions)

async def get_user_goals(db: AsyncSession, user_id: str) -> List[GoalResponse]:
    result = await db.execute(select(Goal).where(Goal.user_id == user_id))
    goals = result.scalars().all()

    goal_responses = []

    for goal in goals:
        current_amount = await calculate_current_amount(db, goal.category_name, goal.goal_type, user_id, goal.period)

        goal_responses.append(GoalResponse(
            id=goal.id,
            user_id=goal.user_id,
            category_name=goal.category_name,
            amount=goal.amount,
            period=goal.period,
            goal_type=goal.goal_type,
            created_at=goal.created_at,
            current_amount=current_amount
        ))

    return goal_responses

async def create_goal(db: AsyncSession, goal_data: GoalCreate, user_id: str) -> GoalResponse:
    new_goal = Goal(
        id=str(uuid4()),
        user_id=user_id,
        category_name=goal_data.category_name,
        amount=goal_data.amount,
        goal_type=goal_data.goal_type,
        period=goal_data.period,
        created_at=datetime.now()
    )

    db.add(new_goal)
    await db.commit()
    await db.refresh(new_goal)

    current_amount = await calculate_current_amount(db, goal_data.category_name, goal_data.goal_type, user_id, goal_data.period)

    return GoalResponse(
        id=new_goal.id,
        user_id=new_goal.user_id,
        category_name=new_goal.category_name,
        amount=new_goal.amount,
        goal_type=new_goal.goal_type,
        period=new_goal.period,
        created_at=new_goal.created_at,
        current_amount=current_amount
    )

async def update_goal(db: AsyncSession, goal_id: str, goal_data: GoalUpdate, user_id: str) -> GoalResponse:
    goal = await db.get(Goal, goal_id)

    if not goal or goal.user_id != user_id:
        raise HTTPException(status_code=404, detail="Goal not found")

    for key, value in goal_data.model_dump(exclude_unset=True).items():
        setattr(goal, key, value)

    await db.commit()
    await db.refresh(goal)

    current_amount = await calculate_current_amount(db, goal.category_name, goal.goal_type, user_id, goal.period)

    return GoalResponse(
        id=goal.id,
        user_id=goal.user_id,
        category_name=goal.category_name,
        amount=goal.amount,
        goal_type=goal.goal_type,
        period=goal.period,
        created_at=goal.created_at,
        current_amount=current_amount
    )

async def delete_goal(db: AsyncSession, goal_id: str, user_id: str):
    goal = await db.get(Goal, goal_id)
    
    if not goal or goal.user_id != user_id:
        raise HTTPException(status_code=404, detail="Goal not found")

    await db.delete(goal)
    await db.commit()
