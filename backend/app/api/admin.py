from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.models.audit_log import AuditLog
from app.schemas.user import User as UserSchema, UserUpdate
from app.schemas.audit_log import AuditLog as AuditLogSchema
from app.api.deps import get_current_admin_user
from app.services.audit import log_action

router = APIRouter()


@router.get("/users", response_model=List[UserSchema])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/users/{user_id}", response_model=UserSchema)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/users/{user_id}/role", response_model=UserSchema)
def change_user_role(
    user_id: int,
    role_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    old_role = user.role
    new_role = role_data.get("role")
    
    if new_role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    user.role = new_role
    db.commit()
    db.refresh(user)
    
    log_action(
        db, "role_change", actor_id=current_user.id,
        target_type="user", target_id=user.id,
        payload={"old_role": old_role, "new_role": new_role}
    )
    return user


@router.put("/users/{user_id}/status", response_model=UserSchema)
def change_user_status(
    user_id: int,
    status_data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot change your own status")
    
    user.is_active = status_data.get("is_active", user.is_active)
    db.commit()
    db.refresh(user)
    
    log_action(
        db, "status_change", actor_id=current_user.id,
        target_type="user", target_id=user.id,
        payload={"is_active": user.is_active}
    )
    return user


@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    old_role = user.role
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    
    if user_update.role and user_update.role != old_role:
        log_action(
            db, "change_role", actor_id=current_user.id,
            target_type="user", target_id=user.id,
            payload={"old_role": old_role, "new_role": user_update.role}
        )
    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db.delete(user)
    db.commit()
    log_action(db, "delete_user", actor_id=current_user.id, target_type="user", target_id=user_id)
    return {"message": "User deleted successfully"}


@router.get("/audit", response_model=List[AuditLogSchema])
def get_audit_logs_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    return logs
