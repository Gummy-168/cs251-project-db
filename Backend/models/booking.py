from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, DECIMAL, Date
from sqlalchemy.orm import relationship
from database import Base

class Promotion(Base):
    __tablename__ = "promotion"
    PromotionID = Column(Integer, primary_key=True, index=True)
    PromotionName = Column(String(100), unique=True, nullable=False)
    DiscountType = Column(String(20), nullable=False)
    DiscountValue = Column(Numeric(5, 2), nullable=False)
    StartDate = Column(Date, nullable=False) # Added to match schema and main.py mock
    EndDate = Column(Date, nullable=False)
    AID = Column(Integer, ForeignKey("admin.AID"), nullable=False)

    bookings = relationship("Booking", back_populates="promotion")

class Booking(Base):
    __tablename__ = "booking"
    BookingID = Column(Integer, primary_key=True, index=True)
    BookingDate = Column(DateTime, nullable=False)
    BookingStatus = Column(String(20), nullable=False)
    TotalPrice = Column(DECIMAL(10, 2), nullable=False)
    UID = Column(Integer, ForeignKey("users.id"), nullable=False)
    ShowtimeID = Column(Integer, ForeignKey("showtime.ShowtimeID"), nullable=False)
    PromotionID = Column(Integer, ForeignKey("promotion.PromotionID"), nullable=True)

    user = relationship("User")
    showtime = relationship("Showtime")
    promotion = relationship("Promotion", back_populates="bookings")
