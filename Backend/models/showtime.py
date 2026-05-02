from sqlalchemy import Column, Integer, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
from database import Base

class Showtime(Base):
    __tablename__ = "showtime"
    ShowtimeID = Column(Integer, primary_key=True, index=True)
    ShowDate = Column(Date, nullable=False)
    StartTime = Column(Time, nullable=False)
    EndTime = Column(Time, nullable=False)
    ThID = Column(Integer, ForeignKey("theater.ThID"), nullable=False)
    MID = Column(Integer, ForeignKey("movie.MID"), nullable=False)

    theater = relationship("Theater", back_populates="showtimes")
    movie = relationship("Movie", back_populates="showtimes")
