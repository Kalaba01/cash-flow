from fastapi import HTTPException
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, ChangePasswordRequest
from app.services.email_service import send_email
from app.core.security import verify_password, get_password_hash, verify_password_reset_token

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user_data: UserCreate):
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    await send_email(
        to_email=user_data.email,
        subject="Welcome to Cash Flow!",
        template_name="welcome_email",
        context={"first_name": user_data.first_name}
    )

    return new_user

async def authenticate_user(db: AsyncSession, email: str, password: str):
    user = await get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None

    return user

async def reset_user_password(db: AsyncSession, token: str, new_password: str):
    reset_token = await verify_password_reset_token(db, token)

    if not reset_token:
        return False

    result = await db.execute(select(User).filter(User.id == reset_token.user_id))
    user = result.scalars().first()

    if not user:
        return False
    
    if verify_password(new_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="New password must be different from old password")

    user.hashed_password = get_password_hash(new_password)

    await db.delete(reset_token)
    await db.commit()
    await db.refresh(user)
    return True

async def update_user_profile(db: AsyncSession, user_id: str, user_data: UserUpdate):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.first_name = user_data.first_name
    user.last_name = user_data.last_name
    user.email = user_data.email

    await db.commit()
    await db.refresh(user)
    return user

async def change_user_password(db: AsyncSession, user: User, request: ChangePasswordRequest):
    if not verify_password(request.old_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect old password")

    if verify_password(request.new_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="New password must be different from the old password")

    user.hashed_password = get_password_hash(request.new_password)

    await db.commit()
    return {"message": "Password successfully changed"}
