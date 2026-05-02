from pydantic import BaseModel, ConfigDict, Field, model_validator
from typing import Optional
from decimal import Decimal
from datetime import date

# promotion schema
class PromotionBase(BaseModel):
    # Note: the current DB schema does not have a dedicated promo code column.
    # PromotionName is therefore the closest identifier available today.
    PromotionName: str
    DiscountType: str = Field(pattern="^(Percentage|Fixed Amount)$")
    DiscountValue: Decimal = Field(ge=0)
    StartDate: date
    EndDate: date
    AID: int

    @model_validator(mode="after")
    def validate_date_range(self):
        if self.EndDate < self.StartDate:
            raise ValueError("EndDate must be greater than or equal to StartDate")
        return self

class PromotionCreate(PromotionBase):
    pass

class PromotionUpdate(BaseModel):
    PromotionName: Optional[str] = None
    DiscountType: Optional[str] = Field(default=None, pattern="^(Percentage|Fixed Amount)$")
    DiscountValue: Optional[Decimal] = Field(default=None, ge=0)
    StartDate: Optional[date] = None
    EndDate: Optional[date] = None

    @model_validator(mode="after")
    def validate_date_range(self):
        if (
            self.StartDate is not None
            and self.EndDate is not None
            and self.EndDate < self.StartDate
        ):
            raise ValueError("EndDate must be greater than or equal to StartDate")
        return self

class PromotionResponse(PromotionBase):
    PromotionID: int
    model_config = ConfigDict(from_attributes=True)


class PromotionValidateRequest(BaseModel):
    PromoCode: str
    TotalPrice: Decimal = Field(ge=0)


class PromotionValidateResponse(BaseModel):
    IsValid: bool
    PromotionID: Optional[int] = None
    PromotionName: Optional[str] = None
    DiscountType: Optional[str] = None
    DiscountValue: Decimal = Decimal("0.00")
    DiscountAmount: Decimal = Decimal("0.00")
    FinalPrice: Decimal = Decimal("0.00")
    Message: str


# /end of promotion schema
