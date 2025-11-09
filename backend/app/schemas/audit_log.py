from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class AuditLogBase(BaseModel):
    actor_id: Optional[int] = None
    action: str
    target_type: Optional[str] = None
    target_id: Optional[int] = None
    ip: Optional[str] = None
    user_agent: Optional[str] = None
    payload: Optional[Any] = None


class AuditLogCreate(AuditLogBase):
    pass


class AuditLogInDB(AuditLogBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AuditLog(AuditLogInDB):
    pass


class AuditLogList(BaseModel):
    logs: list[AuditLog]
    total: int
