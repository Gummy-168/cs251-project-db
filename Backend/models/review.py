from sqlalchemy import Column, Integer, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import date as py_date

class Review(Base):
    __tablename__ = "review"

    ReviewID = Column(Integer, primary_key=True, index=True)
    ReviewDate = Column(Date, nullable=False, default=py_date.today)
    ReviewScore = Column(Integer, nullable=False)
    Comment = Column(Text, nullable=True)

    UID = Column(Integer, ForeignKey("users.id"), nullable=False)
    MID = Column(Integer, ForeignKey("movie.MID"), nullable=False)

    user = relationship("User")
    movie = relationship("Movie")
