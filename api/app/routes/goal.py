from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.database import get_db
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalResponse, GoalUpdate
from app.core.security import get_current_user
from app.services.goal_service import get_user_goals, create_goal, update_goal, delete_goal

router = APIRouter(prefix="/goal", tags=["Goal"])

@router.get("/", response_model=List[GoalResponse])
async def get_goals(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await get_user_goals(db, current_user.id)

@router.post("/", response_model=GoalResponse)
async def create_goal_endpoint(goal_data: GoalCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await create_goal(db, goal_data, current_user.id)

@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal_endpoint(goal_id: str, goal_data: GoalUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await update_goal(db, goal_id, goal_data, current_user.id)

@router.delete("/{goal_id}", status_code=204)
async def delete_goal_endpoint(goal_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await delete_goal(db, goal_id, current_user.id)
