from pydantic import BaseModel
from typing import Optional, Dict

class UserProfileCreate(BaseModel):
    full_name: str
    email: str
    metadata: Optional[Dict] = None

class UserProfileUpdate(BaseModel):
    full_name: Optional[str]
    email: Optional[str]
    metadata: Optional[Dict]

class UserProfileResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    avatar_url: Optional[str]
    metadata: Optional[Dict]

class UserRoleAssign(BaseModel):
    role_id: int