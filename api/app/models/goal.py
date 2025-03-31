import uuid
import enum
from sqlalchemy import Column, String, Float, Enum, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class GoalType(str, enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"

class GoalPeriod(str, enum.Enum):
    SEVEN_DAYS = "week"
    MONTH = "month"
    YEAR = "year"
    FOREVER = "forever"

class Goal(Base):
    __tablename__ = "goals"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    category_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    goal_type = Column(Enum(GoalType), nullable=False)
    period = Column(Enum(GoalPeriod), nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
