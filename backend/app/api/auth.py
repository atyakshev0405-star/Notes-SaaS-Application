from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    Token, LoginRequest, RegisterRequest,
    PasswordResetRequest, PasswordResetConfirm, EmailVerificationRequest
)
from app.schemas.user import User as UserSchema
from app.services.auth import (
    authenticate_user, create_user, verify_email,
    create_password_reset_token, reset_password, create_tokens, refresh_access_token, logout
)
from app.services.audit import log_action
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=Token)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, request.email, request.password)
    tokens = create_tokens(user)
    log_action(db, "register", actor_id=user.id, target_type="user", target_id=user.id)
    return tokens


@router.post("/verify-email")
def verify_email_endpoint(request: EmailVerificationRequest, db: Session = Depends(get_db)):
    if not verify_email(db, request.token):
        raise HTTPException(status_code=400, detail="Invalid token")
    return {"message": "Email verified successfully"}


@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db), req: Request = None):
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified")
    tokens = create_tokens(user)
    log_action(
        db, "login", actor_id=user.id,
        ip=req.client.host if req else None,
        user_agent=req.headers.get("user-agent") if req else None
    )
    return tokens


@router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    # Extract user_id from refresh token
    from app.core.security import verify_token
    user_id = verify_token(refresh_token, "refresh")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    tokens = refresh_access_token(int(user_id), refresh_token)
    if not tokens:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    return tokens


@router.get("/me", response_model=UserSchema)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout")
def logout_endpoint(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    logout(current_user.id)
    log_action(db, "logout", actor_id=current_user.id)
    return {"message": "Logged out successfully"}


@router.post("/password-reset-request")
def password_reset_request(request: PasswordResetRequest, db: Session = Depends(get_db)):
    if not create_password_reset_token(db, request.email):
        raise HTTPException(status_code=400, detail="Email not found")
    return {"message": "Password reset email sent"}


@router.post("/password-reset-confirm")
def password_reset_confirm(request: PasswordResetConfirm, db: Session = Depends(get_db)):
    if not reset_password(db, request.token, request.new_password):
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    return {"message": "Password reset successfully"}
