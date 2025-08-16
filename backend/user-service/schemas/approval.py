from pydantic import BaseModel
from enum import Enum

class ApprovalStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class UserApprovalCreate(BaseModel):
    user_id: int
    status: ApprovalStatus

class UserApprovalResponse(BaseModel):
    id: int
    user_id: int
    status: ApprovalStatus
    approver_id: Optional[int]