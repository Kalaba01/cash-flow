from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserBase(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    email: EmailStr
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserResponse(UserBase):
    id: str
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
