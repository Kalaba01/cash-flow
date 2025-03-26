from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.email_service import send_email

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user_data: UserCreate):
    hashed_password = pwd_context.hash(user_data.password)
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
