from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from app.models.goal import GoalPeriod, GoalType

class GoalBase(BaseModel):
    category_name: str
    amount: float = Field(..., gt=0, description="Budget must be greater than 0")
    goal_type: GoalType
    period: GoalPeriod

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    category_name: str | None = None
    amount: float | None = None
    goal_type: GoalType | None = None
    period: GoalPeriod | None = None

class GoalResponse(GoalBase):
    id: str
    user_id: str
    created_at: datetime
    current_amount: float

    model_config = ConfigDict(from_attributes=True)
