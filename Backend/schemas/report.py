from datetime import date
from decimal import Decimal
from pydantic import BaseModel


class TrendingMovieReportResponse(BaseModel):
    MID: int
    MName: str
    Description: str | None = None


class PerformanceLogResponse(BaseModel):
    MID: int
    MName: str
    ShowDate: date
    TCOUNT: int
    INCOME: Decimal


class PerformanceLogPageResponse(BaseModel):
    items: list[PerformanceLogResponse]
    total: int
    page: int
    limit: int
