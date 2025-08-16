from fastapi import Depends, HTTPException, UploadFile
from sqlalchemy.orm import Session
from models.user_profile import UserProfile
from models.user_approval import UserApproval
from schemas.user import UserProfileCreate, UserProfileUpdate, UserProfileResponse, UserRoleAssign
from schemas.approval import UserApprovalCreate, UserApprovalResponse
from config.database import get_db
import requests
from services.s3_service import upload_avatar_to_s3

class UserService:
    @staticmethod
    def create_user_profile(profile: UserProfileCreate, user_id: int, db: Session = Depends(get_db)):
        existing = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="User profile already exists")
        db_profile = UserProfile(
            user_id=user_id,
            full_name=profile.full_name,
            email=profile.email,
            metadata_json=profile.metadata
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return UserProfileResponse(**db_profile.__dict__)

    @staticmethod
    def update_user_profile(user_id: int, profile: UserProfileUpdate, db: Session = Depends(get_db)):
        db_profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not db_profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        update_data = profile.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_profile, key, value)
        db.commit()
        db.refresh(db_profile)
        return UserProfileResponse(**db_profile.__dict__)

    @staticmethod
    def get_user_profile(user_id: int, db: Session = Depends(get_db)):
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        return UserProfileResponse(**profile.__dict__)

    @staticmethod
    def delete_user_profile(user_id: int, db: Session = Depends(get_db)):
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        db.delete(profile)
        db.commit()
        return {"message": "User profile deleted"}

    @staticmethod
    async def upload_avatar(user_id: int, file: UploadFile, db: Session = Depends(get_db)):
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        avatar_url = await upload_avatar_to_s3(user_id, file)
        profile.avatar_url = avatar_url
        db.commit()
        db.refresh(profile)
        return UserProfileResponse(**profile.__dict__)

    @staticmethod
    def create_approval(approval: UserApprovalCreate, approver_id: int, db: Session = Depends(get_db)):
        db_approval = UserApproval(
            user_id=approval.user_id,
            status=approval.status,
            approver_id=approver_id
        )
        db.add(db_approval)
        db.commit()
        db.refresh(db_approval)
        return UserApprovalResponse(**db_approval.__dict__)

    @staticmethod
    def assign_role(user_id: int, role: UserRoleAssign):
        # Giả lập gọi API tới Authentication Service để cấp role
        response = requests.post(
            "http://auth-service/api/roles/assign",  # URL của Auth Service
            json={"user_id": user_id, "role_id": role.role_id}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to assign role")
        return {"message": "Role assigned"}