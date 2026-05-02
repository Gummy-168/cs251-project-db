from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date
from decimal import Decimal

class BookingSeatSelection(BaseModel):
    SeatRow: str
    SeatNumber: int


class BookingCreate(BaseModel):
    ShowtimeID: int
    UID: int
    Seats: list[BookingSeatSelection]
    PromotionID: Optional[int] = None


class BookingResponse(BaseModel):
    BookingID: int
    BookingDate: date
    BookingStatus: str
    TotalPrice: Decimal
    UID: int
    ShowtimeID: int
    PromotionID: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)


class UserBookingSeatResponse(BaseModel):
    TicketID: int
    SeatID: int
    SeatRow: str
    SeatNumber: int
    Price: Decimal


class UserBookingReviewResponse(BaseModel):
    ReviewID: int
    ReviewDate: date
    ReviewScore: int
    Comment: Optional[str] = None


class UserBookingHistoryResponse(BaseModel):
    BookingID: int
    BookingDate: date
    BookingStatus: str
    TotalPrice: Decimal
    UID: int
    ShowtimeID: int
    PromotionID: Optional[int] = None
    MID: int
    MName: str
    ShowDate: date
    StartTime: str
    EndTime: str
    BID: int
    BName: str
    BLocation: str
    ThID: int
    ThNumber: int
    ThType: str
    Seats: list[UserBookingSeatResponse]
    Review: Optional[UserBookingReviewResponse] = None
