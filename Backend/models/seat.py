from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Seat(Base):
    __tablename__ = "seat"
    SeatID = Column(Integer, primary_key=True, index=True)
    SeatStatus = Column(String(20), nullable=False)
    SeatRow = Column(String(1), nullable=False)
    SeatNumber = Column(Integer, nullable=False)
    SeatType = Column(String(50), nullable=False)
    ThID = Column(Integer, ForeignKey("theater.ThID"), nullable=False)

    theater = relationship("Theater", back_populates="seats")
