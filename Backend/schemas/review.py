from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import date

# Review Schemas
class ReviewBase(BaseModel):
    ReviewScore: int = Field(ge=1, le=5)
    Comment: Optional[str] = None
    UID: int
    MID: int

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    ReviewID: int
    ReviewDate: date
    model_config = ConfigDict(from_attributes=True)
# \end of Review Schemas
