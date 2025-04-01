from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserResponse, UserUpdate, ChangePasswordRequest
from app.models.user import User
from app.db.database import get_db
from app.core.security import get_current_user, get_password_hash, verify_password
from app.services.user_service import update_user_profile, change_user_password

router = APIRouter(prefix="/profile", tags=["Profile"]) # Define router for profile-related API routes

# Return the current authenticated user's profile
@router.get("/", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

# Update the current user's profile information
@router.post("/update", response_model=UserResponse)
async def update_profile(
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await update_user_profile(db, current_user.id, user_data)

# Change the password of the current authenticated user
@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await change_user_password(db, current_user, request)
