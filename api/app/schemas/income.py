from pydantic import BaseModel
from datetime import datetime

class IncomeBase(BaseModel):
    category_name: str
    amount: float
    date: datetime
    description: str | None = None

class IncomeCreate(IncomeBase):
    pass

class IncomeResponse(IncomeBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True
