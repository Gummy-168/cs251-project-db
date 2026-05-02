from sqlalchemy import Column, Integer, String, Text, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Movie(Base):
    __tablename__ = "movie"
    MID = Column(Integer, primary_key=True, index=True)
    MName = Column(String(200), nullable=False)
    Genre = Column(String(50), nullable=False)
    Duration = Column(Integer, nullable=False)
    AgeRating = Column(String(10), nullable=False)
    Description = Column(Text)
    ReleaseDate = Column(Date, nullable=False)
    Actor = Column(String(255))
    Director = Column(String(100))
    ScoreRating = Column(Numeric(2, 1), default=0.0)
    AID = Column(Integer, ForeignKey("admin.AID"), nullable=False)

    admin = relationship("Admin", back_populates="movies")
    showtimes = relationship("Showtime", back_populates="movie")
