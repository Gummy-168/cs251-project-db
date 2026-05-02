from sqlalchemy import Column, Integer, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from database import Base

class Ticket(Base):
    __tablename__ = "ticket"
    TicketID = Column(Integer, primary_key=True, index=True)
    SeatID = Column(Integer, ForeignKey("seat.SeatID"), nullable=False)
    BookingID = Column(Integer, ForeignKey("booking.BookingID"), nullable=False)
    Price = Column(DECIMAL(7, 2), nullable=False)

    seat = relationship("Seat")
    booking = relationship("Booking")
