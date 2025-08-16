from sqlalchemy import Column, BigInteger, String, Enum, DateTime
from sqlalchemy.sql import func
from config.database import Base

class UserApproval(Base):
    __tablename__ = "user_approvals"
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, nullable=False)
    status = Column(Enum('pending', 'approved', 'rejected'), nullable=False)
    approver_id = Column(BigInteger)
    created_at = Column(DateTime, default=func.now())
    system_id = Column(String(50), default='system1')