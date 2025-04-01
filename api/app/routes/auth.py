from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.token import Token
from app.services.user_service import authenticate_user, create_user, get_user_by_email, reset_user_password
from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, create_password_reset_token
from app.schemas.user import UserCreate, UserResponse, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.services.email_service import send_email
from app.db.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"]) # Define router for authentication-related routes

# Register a new user
@router.post("/register", response_model=UserResponse)
async def register_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already in use")

    new_user = await create_user(db, user_data)
    return new_user

# Log in a user and return JWT access token
@router.post("/login", response_model=Token)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, request.email, request.password)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Request password reset link via email
@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    token = await create_password_reset_token(db, request.email)

    if not token:
        return {"message": "If the email exists, a reset link has been sent."}

    reset_link = f"http://localhost:3000/reset-password?token={token}"
    user = await get_user_by_email(db, request.email)

    await send_email(
        to_email=request.email,
        subject="Password Reset Request",
        template_name="reset_password",
        context={
            "reset_link": reset_link,
            "user_first_name": user.first_name
        }
    )

    return {"message": "If the email exists, a reset link has been sent."}

# Reset the user's password using token
@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    success = await reset_user_password(db, request.token, request.new_password)

    if not success:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    return {"message": "Password reset successful"}
