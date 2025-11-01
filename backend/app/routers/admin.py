from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, AuditLog
from .auth import get_current_user
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter()

class UserResponse(BaseModel):
    id: int
    email: str
    is_active: bool
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    action: str
    details: str
    timestamp: datetime

    class Config:
        from_attributes = True

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

@router.get("/users", response_model=List[UserResponse])
def get_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.put("/users/{user_id}/activate")
def activate_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = True
    db.commit()
    return {"message": "User activated"}

@router.put("/users/{user_id}/deactivate")
def deactivate_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    return {"message": "User deactivated"}

@router.put("/users/{user_id}/role")
def change_role(user_id: int, role: str, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if role not in ["admin", "user"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    return {"message": f"Role changed to {role}"}

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    logs = db.query(AuditLog).offset(skip).limit(limit).all()
    return logs
