from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Branch(Base):
    __tablename__ = "branch"
    BID = Column(Integer, primary_key=True, index=True)
    BName = Column(String(100), nullable=False)
    BLocation = Column(String(255), nullable=False)
    BPhoneNumber = Column(String(15), unique=True, nullable=False)

    theaters = relationship("Theater", back_populates="branch")
