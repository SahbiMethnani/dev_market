from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    role: Literal["developer", "client"]


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: EmailStr
    role: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ProjectOut(BaseModel):
    id: int
    title: str
    price: float
    description: str
    url: Optional[str] = None
    screenshot: Optional[str] = None
    developer_id: int
    developer_username: str
    created_at: datetime


class ConversationCreate(BaseModel):
    project_id: int


class ConversationOut(BaseModel):
    id: int
    project_id: int
    project_title: str
    other_username: str
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread: int = 0


class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    conversation_id: int
    sender_id: int
    content: str
    created_at: datetime
