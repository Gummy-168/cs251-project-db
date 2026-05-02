from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Theater(Base):
    __tablename__ = "theater"
    ThID = Column(Integer, primary_key=True, index=True)
    ThNumber = Column(Integer, nullable=False)
    ThType = Column(String(50), nullable=False)
    Capacity = Column(Integer, nullable=False)
    BID = Column(Integer, ForeignKey("branch.BID"), nullable=False)

    branch = relationship("Branch", back_populates="theaters")
    showtimes = relationship("Showtime", back_populates="theater")
    seats = relationship("Seat", back_populates="theater")
