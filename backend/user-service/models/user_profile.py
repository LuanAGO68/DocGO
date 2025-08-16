from sqlalchemy import Column, BigInteger, String, JSON
from config.database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    user_id = Column(BigInteger, primary_key=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    avatar_url = Column(String(512))
    metadata_json = Column(JSON)
    system_id = Column(String(50), default='system1')