from pydantic import BaseModel, ConfigDict
from datetime import datetime

class ExpenseBase(BaseModel):
    category_name: str
    amount: float
    date: datetime
    description: str | None = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: str
    user_id: str
    date: datetime

    model_config = ConfigDict(from_attributes=True)
