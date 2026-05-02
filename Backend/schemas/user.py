from pydantic import BaseModel, ConfigDict
from typing import Optional


class UserBase(BaseModel):
    Username: str
    UName: str
    UEmail: str
    UPhoneNumber: str


class UserCreate(UserBase):
    UPassword: str


class UserLogin(BaseModel):
    Username: Optional[str] = None
    UEmail: Optional[str] = None
    UPassword: str


class UserUpdate(BaseModel):
    Username: str
    UName: str
    UEmail: str
    UPhoneNumber: str


class UserResponse(UserBase):
    UID: int
    model_config = ConfigDict(from_attributes=True)


class UserSigninResponse(BaseModel):
    success: bool
    user: UserResponse
