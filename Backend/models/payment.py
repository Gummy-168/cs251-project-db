from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from database import Base

class Payment(Base):
    __tablename__ = "payment"
    PaymentID = Column(Integer, primary_key=True, index=True)
    Amount = Column(DECIMAL(10, 2), nullable=False)
    PaymentStatus = Column(String(20), nullable=False)
    PaymentDate = Column(DateTime, nullable=False)
    PaymentMethod = Column(String(50), nullable=False)
    BookingID = Column(Integer, ForeignKey("booking.BookingID"), nullable=False)

    booking = relationship("Booking")
