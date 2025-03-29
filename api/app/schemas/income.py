from pydantic import BaseModel, ConfigDict
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

    model_config = ConfigDict(from_attributes=True)
