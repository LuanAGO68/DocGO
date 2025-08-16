from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from schemas.user import UserProfileCreate, UserProfileUpdate, UserProfileResponse, UserRoleAssign
from schemas.approval import UserApprovalCreate, UserApprovalResponse
from services.user_service import UserService
from config.database import get_db
from dependencies.auth import get_current_user

router = APIRouter(prefix="/api/v1/users", tags=["users"])

@router.post("/", response_model=UserProfileResponse)
def create_user_profile(
    profile: UserProfileCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return UserService.create_user_profile(profile, current_user["sub"], db)

@router.get("/{user_id}", response_model=UserProfileResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    return UserService.get_user_profile(user_id, db)

@router.put("/{user_id}", response_model=UserProfileResponse)
def update_user_profile(
    user_id: int,
    profile: UserProfileUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return UserService.update_user_profile(user_id, profile, db)

@router.delete("/{user_id}")
def delete_user_profile(user_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    return UserService.delete_user_profile(user_id, db)

@router.post("/{user_id}/avatar", response_model=UserProfileResponse)
async def upload_avatar(
    user_id: int,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await UserService.upload_avatar(user_id, file, db)

@router.post("/approvals", response_model=UserApprovalResponse)
def create_approval(
    approval: UserApprovalCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return UserService.create_approval(approval, current_user["sub"], db)

@router.post("/{user_id}/roles")
def assign_role(
    user_id: int,
    role: UserRoleAssign,
    current_user: dict = Depends(get_current_user)
):
    return UserService.assign_role(user_id, role)