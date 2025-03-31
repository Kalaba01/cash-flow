from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate
from uuid import uuid4
from typing import List
from fastapi import HTTPException

async def get_user_goals(db: AsyncSession, user_id: str) -> List[Goal]:
    """ Dohvati sve ciljeve korisnika """
    result = await db.execute(select(Goal).where(Goal.user_id == user_id))
    return result.scalars().all()

async def create_goal(db: AsyncSession, goal_data: GoalCreate, user_id: str) -> Goal:
    """ Kreira novi cilj (budžet) """
    new_goal = Goal(
        id=str(uuid4()),
        user_id=user_id,
        category_name=goal_data.category_name,
        amount=goal_data.amount,
        goal_type=goal_data.goal_type,
        period=goal_data.period,
    )
    db.add(new_goal)
    await db.commit()
    await db.refresh(new_goal)
    return new_goal

async def update_goal(db: AsyncSession, goal_id: str, goal_data: GoalUpdate, user_id: str) -> Goal:
    """ Ažurira postojeći cilj """
    goal = await db.get(Goal, goal_id)
    
    if not goal or goal.user_id != user_id:
        raise HTTPException(status_code=404, detail="Goal not found")

    for key, value in goal_data.dict(exclude_unset=True).items():
        setattr(goal, key, value)

    await db.commit()
    await db.refresh(goal)
    return goal

async def delete_goal(db: AsyncSession, goal_id: str, user_id: str):
    """ Briše postojeći cilj """
    goal = await db.get(Goal, goal_id)
    
    if not goal or goal.user_id != user_id:
        raise HTTPException(status_code=404, detail="Goal not found")

    await db.delete(goal)
    await db.commit()
