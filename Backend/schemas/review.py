from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

# Review Schemas
class ReviewBase(BaseModel):
    ReviewScore: int
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