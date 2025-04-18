import os
import secrets
from datetime import datetime, timedelta, timezone, UTC
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from dotenv import load_dotenv
from app.db.database import get_db
from app.models.user import User
from app.models.password_reset import PasswordResetToken

load_dotenv() # Load environment variables from .env file

SECRET_KEY = os.getenv("SECRET_KEY") # Secret key for encoding JWT tokens
ALGORITHM = os.getenv("ALGORITHM") # Algorithm used for JWT encoding/decoding
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")) # Expiration time for access tokens in minutes

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # Password hashing context using bcrypt
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login") # OAuth2 password flow dependency for token extraction

# Hashes a plain password using bcrypt
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Verifies a plain password against a hashed password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Creates a JWT access token with optional expiration delta
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Decodes and verifies the JWT token and extracts user email
def verify_token(token: str, credentials_exception: HTTPException) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        return email
    except JWTError:
        raise credentials_exception

# Retrieves the currently authenticated user from the database using JWT token
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    email = verify_token(token, credentials_exception)

    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()

    if user is None:
        raise credentials_exception

    return user

# Generates a secure random token for password reset
def generate_reset_token() -> str:
    return secrets.token_urlsafe(32)

# Creates a new password reset token in the database for a given user or deletes any previous token for that user
async def create_password_reset_token(db: AsyncSession, email: str):
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()

    if not user:
        return None

    await db.execute(delete(PasswordResetToken).where(PasswordResetToken.user_id == user.id))
    await db.commit()

    token = generate_reset_token()
    expires_at = datetime.now(UTC) + timedelta(hours=24)

    reset_token = PasswordResetToken(user_id=user.id, token=token, expires_at=expires_at)
    db.add(reset_token)
    await db.commit()
    await db.refresh(reset_token)

    return reset_token.token

# Verifies the validity of a password reset token (existence and expiration)
async def verify_password_reset_token(db: AsyncSession, token: str):
    result = await db.execute(select(PasswordResetToken).filter(PasswordResetToken.token == token))
    reset_token = result.scalars().first()

    if not reset_token:
        return None

    expires_at = reset_token.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        return None

    return reset_token
