from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Admin(Base):
    __tablename__ = "admin"
    AID = Column(Integer, primary_key=True, index=True)
    AName = Column(String(100), nullable=False)
    AEmail = Column(String(100), unique=True, nullable=False)
    APassword = Column(String(255), nullable=False)

    movies = relationship("Movie", back_populates="admin")
