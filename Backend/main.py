from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, SessionLocal
from typing import List
import models
import schemas

# Initialize database tables
# TODO: Uncomment this when database choice is finalized to auto-create tables
# models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow Frontend to call Backend ห้ามลบเด็ดขาด ไม่งั้น frontend จะเรียก backend ไม่ได้นะเพื่อนนนนนนนนนนนนนนนนนนนนนนนนนนน
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://172.22.144.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/db-test")
def db_test(db: Session = Depends(get_db)):
    """
    Test connection to the database
    """
    try:
        db.execute(text("SELECT 1"))
        return {"message": "Database connected successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# Admin Endpoints - Movie

@app.post("/api/admin/movies", response_model=schemas.MovieResponse, tags=["Admin - Movie"], status_code=status.HTTP_201_CREATED)
def create_movie(movie: schemas.MovieCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Movie
    TODO: Database implement (models.Movie(**movie.model_dump()) -> db.add -> db.commit)
    """
    # MOCK DATA: Replace with real database output
    return {**movie.model_dump(), "MID": 999, "ScoreRating": 0.0, "AID": 1}

@app.put("/api/admin/movies/{movie_id}", response_model=schemas.MovieResponse, tags=["Admin - Movie"])
def update_movie(movie_id: int, movie: schemas.MovieUpdate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Movie
    TODO: Database implement (db.query(models.Movie).update -> db.commit)
    """
    # MOCK DATA: Replace with real database output
    return {
        "MID": movie_id,
        "MName": movie.MName or "Updated Name",
        "Genre": movie.Genre or "Action",
        "Duration": movie.Duration or 120,
        "AgeRating": movie.AgeRating or "G",
        "ReleaseDate": movie.ReleaseDate or "2026-01-01",
        "AID": 1
    }

@app.delete("/api/admin/movies/{movie_id}", tags=["Admin - Movie"], status_code=status.HTTP_204_NO_CONTENT)
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Movie
    TODO: Database implement (db.delete WHERE MID = movie_id)
    """
    # MOCK SUCCESS: Returns empty 204 response
    return None

# Admin Endpoints - Showtime

@app.post("/api/admin/showtimes", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"], status_code=status.HTTP_201_CREATED)
def create_showtime(showtime: schemas.ShowtimeCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Showtime
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**showtime.model_dump(), "ShowtimeID": 888}

@app.put("/api/admin/showtimes/{showtime_id}", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"])
def update_showtime(showtime_id: int, showtime: schemas.ShowtimeCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Showtime
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**showtime.model_dump(), "ShowtimeID": showtime_id}

@app.delete("/api/admin/showtimes/{showtime_id}", tags=["Admin - Showtime"], status_code=status.HTTP_204_NO_CONTENT)
def delete_showtime(showtime_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Showtime
    TODO: Database implement
    """
    return None

# Admin Endpoints - Branch

@app.post("/api/admin/branches", response_model=schemas.BranchResponse, tags=["Admin - Branch"], status_code=status.HTTP_201_CREATED)
def create_branch(branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Branch
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**branch.model_dump(), "BID": 1}

@app.put("/api/admin/branches/{branch_id}", response_model=schemas.BranchResponse, tags=["Admin - Branch"])
def update_branch(branch_id: int, branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Branch
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**branch.model_dump(), "BID": branch_id}

@app.delete("/api/admin/branches/{branch_id}", tags=["Admin - Branch"], status_code=status.HTTP_204_NO_CONTENT)
def delete_branch(branch_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Branch
    TODO: Database implement
    """
    return None

# Admin Endpoints - Theater

@app.post("/api/admin/theaters", response_model=schemas.TheaterResponse, tags=["Admin - Theater"], status_code=status.HTTP_201_CREATED)
def create_theater(theater: schemas.TheaterCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Theater
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**theater.model_dump(), "ThID": 101}

@app.put("/api/admin/theaters/{theater_id}", response_model=schemas.TheaterResponse, tags=["Admin - Theater"])
def update_theater(theater_id: int, theater: schemas.TheaterCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Theater
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**theater.model_dump(), "ThID": theater_id}

@app.delete("/api/admin/theaters/{theater_id}", tags=["Admin - Theater"], status_code=status.HTTP_204_NO_CONTENT)
def delete_theater(theater_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Theater
    TODO: Database implement
    """
    return None

# Admin Endpoints - Seat

@app.post("/api/admin/seats", response_model=schemas.SeatResponse, tags=["Admin - Seat"], status_code=status.HTTP_201_CREATED)
def create_seat(seat: schemas.SeatCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Seat
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**seat.model_dump(), "SeatID": 5001}

@app.put("/api/admin/seats/{seat_id}", response_model=schemas.SeatResponse, tags=["Admin - Seat"])
def update_seat(seat_id: int, seat: schemas.SeatCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Seat
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**seat.model_dump(), "SeatID": seat_id}

@app.delete("/api/admin/seats/{seat_id}", tags=["Admin - Seat"], status_code=status.HTTP_204_NO_CONTENT)
def delete_seat(seat_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Seat
    TODO: Database implement
    """
    return None

# Admin Endpoints - Promotion

@app.post("/api/admin/promotions", response_model=schemas.PromotionResponse, tags=["Admin - Promotion"], status_code=status.HTTP_201_CREATED)
def create_promotion(promotion: schemas.PromotionCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Promotion
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**promotion.model_dump(), "PromotionID": 4001}

@app.put("/api/admin/promotions/{promotion_id}", response_model=schemas.PromotionResponse, tags=["Admin - Promotion"])
def update_promotion(promotion_id: int, promotion: schemas.PromotionUpdate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Promotion
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**promotion.model_dump(), "PromotionID": promotion_id}

@app.delete("/api/admin/promotions/{promotion_id}", tags=["Admin - Promotion"], status_code=status.HTTP_204_NO_CONTENT)
def delete_promotion(promotion_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Promotion
    TODO: Database implement
    """
    return None

# Admin Endpoints - Payment

@app.get("/api/admin/payments/{payment_id}", response_model=List[schemas.PaymentResponse], tags=["Admin - Payment"])
def get_all_payments(payment_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Get All Payments
    TODO: Database implement (SELECT * FROM Payment)
    """
    # MOCK DATA: Replace with real database query output
    return [
        {
            "PaymentID": payment_id,
            "BookingID": 7777,
            "Amount": 250.00,
            "PaymentMethod": "Credit Card",
            "PaymentStatus": "Completed"
        }
    ]

# user endpoints

@app.get("/api/movies", response_model=List[schemas.MovieResponse], tags=["User - Cinema"])
def search_movies(name: str = None, date: str = None, branch: str = None, db: Session = Depends(get_db)):
    """
    User Function: Search Movie and Showtime
    TODO: Database implement (SELECT with filters)
    """
    # MOCK DATA: Replace with real database query output
    return [
        {
            "MID": 1,
            "MName": "Jujutsu Kaisen 0",
            "Genre": "Action",
            "Duration": 105,
            "AgeRating": "PG-13",
            "ReleaseDate": "2026-04-14",
            "AID": 1
        }
    ]

@app.get("/api/showtimes/{showtime_id}/seats", response_model=List[schemas.SeatResponse], tags=["User - Cinema"])
def check_available_seats(showtime_id: int, db: Session = Depends(get_db)):
    """
    User Function: Check Available Seat
    TODO: Database implement (SELECT * FROM Seat WHERE ThID = ...)
    """
    # MOCK DATA: Replace with real database query output
    return [
        {
            "SeatID": 5001,
            "SeatStatus": "Available",
            "SeatRow": "A",
            "SeatNumber": 12,
            "SeatType": "Standard",
            "ThID": 101
        }
    ]

# branch endpoints

@app.get("/api/branches/{branch_id}", response_model=List[schemas.BranchResponse], tags=["User - Branch"])
def search_branches(branch_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Branches
    TODO: Database implement (SELECT * FROM Branch)
    """
    # MOCK DATA: Replace with real database query output
    return [
        {
            "BranchID": branch_id,
            "BranchName": "Cineplex Downtown",
            "BranchLocation": "123 Main St, City"
        }
    ]

#booking endpoints

@app.post("/api/bookings", response_model=schemas.BookingResponse, tags=["User - Booking"], status_code=status.HTTP_201_CREATED)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    """
    User Function: Create Booking
    TODO: Database implement (INSERT INTO Booking -> db.commit)
    """
    # MOCK DATA: Replace with real database output
    return {**booking.model_dump(), "BookingID": 7777}

@app.get("/api/bookings/{booking_id}", response_model=schemas.BookingResponse, tags=["User - Booking"])
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Booking Details
    TODO: Database implement (SELECT * FROM Booking WHERE BookingID = booking_id)
    """
    # MOCK DATA: Replace with real database query output
    return {
        "BookingID": booking_id,
        "ShowtimeID": 888,
        "UserID": 123,
        "SeatID": 5001,
        "PromotionID": None
    }

@app.delete("/api/bookings/{booking_id}", tags=["User - Booking"], status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    """
    User Function: Delete Booking
    TODO: Database implement (DELETE FROM Booking WHERE BookingID = booking_id)
    """
    return None


# payment endpoints

@app.post("/api/payments", response_model=schemas.PaymentResponse, tags=["User - Payment"], status_code=status.HTTP_201_CREATED)
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    """
    User Function: Create Payment
    TODO: Database implement (INSERT INTO Payment -> db.commit)
    """
    # MOCK DATA: Replace with real database output
    return {**payment.model_dump(), "PaymentID": 5555}

@app.get("/api/payments/{payment_id}", response_model=schemas.PaymentResponse, tags=["User - Payment"])
def get_payment(payment_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Payment Details
    TODO: Database implement (SELECT * FROM Payment WHERE PaymentID = payment_id)
    """
    # MOCK DATA: Replace with real database query output
    return {
        "PaymentID": payment_id,
        "BookingID": 7777,
        "Amount": 250.00,
        "PaymentMethod": "Credit Card",
        "PaymentStatus": "Completed"
    }


#booking endpoints

@app.get("/api/tickets/{booking_id}", response_model=List[schemas.TicketResponse], tags=["User - Ticket"])
def get_tickets_by_booking(booking_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Tickets by Booking
    TODO: Database implement (SELECT * FROM Ticket WHERE BookingID = booking_id)
    """
    # MOCK DATA: Replace with real database query output
    return [
        {
            "TicketID": 9001,
            "SeatID": 5001,
            "BookingID": booking_id,
            "Price": 250.00
        }
    ]


# review endpoints

@app.post("/api/reviews", response_model=schemas.ReviewResponse, tags=["User - Review"], status_code=status.HTTP_201_CREATED)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    """
    User Function: Create Review
    TODO: Database implement (INSERT INTO Review -> db.commit)
    """
    # MOCK DATA: Replace with real database output
    return {**review.model_dump(), "ReviewID": 3001}

@app.get("/api/reviews/{movie_id}", response_model=List[schemas.ReviewResponse], tags=["User - Review"])
def get_reviews_by_movie(movie_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Reviews by Movie
    TODO: Database implement (SELECT * FROM Review WHERE MID = movie_id)
    """
    # MOCK DATA: Replace with real database query output
    return [
        {
            "ReviewID": 3001,
            "UID": 123,
            "MID": movie_id,
            "ReviewScore": 5,
            "Comment": "Amazing movie! Highly recommend."
        }
    ]

@app.get("/api/reviews/user/{user_id}", response_model=List[schemas.ReviewResponse], tags=["User - Review"])
def get_reviews_by_user(user_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Reviews by User
    TODO: Database implement (SELECT * FROM Review WHERE UID = user_id)
    """
    # MOCK DATA: Replace with real database query output
    return [
        {
            "ReviewID": 3001,
            "UID": user_id,
            "MID": 1,
            "ReviewScore": 5,
            "Comment": "Amazing movie! Highly recommend."
        }
    ]

@app.delete("/api/reviews/{review_id}", tags=["User - Review"], status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    """
    User Function: Delete Review
    TODO: Database implement (DELETE FROM Review WHERE ReviewID = review_id)
    """
    return None


# promotion endpoints

@app.get("/api/promotions/{promotion_id}", response_model=List[schemas.PromotionResponse], tags=["User - Promotion"])
def get_promotions(promotion_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Promotions
    TODO: Database implement (SELECT * FROM Promotion)
    """
    # MOCK DATA: Replace with real database query output
    return [
        {
            "PromotionID": promotion_id,
            "PromotionName": "Summer Sale",
            "DiscountType": "Percentage",
            "DiscountValue": 10.00,
            "StartDate": "2026-06-01",
            "EndDate": "2026-08-31",
            "AID": 1
        }
    ]

@app.post("/api/promotions/apply", response_model=schemas.PromotionResponse, tags=["User - Promotion"])
def apply_promotion(promotion_id: int, booking_id: int, db: Session = Depends(get_db)):
    """
    User Function: Apply Promotion to Booking
    TODO: Database implement (UPDATE Booking SET PromotionID = promotion_id WHERE BookingID = booking_id)
    """
    # MOCK DATA: Replace with real database query output
    return {
        "PromotionID": promotion_id,
        "PromotionName": "Summer Sale",
        "DiscountType": "Percentage",
        "DiscountValue": 10.00,
        "StartDate": "2026-06-01",
        "EndDate": "2026-08-31",
        "AID": 1
    }

@app.post("/api/promotions/remove", tags=["User - Promotion"], status_code=status.HTTP_204_NO_CONTENT)
def remove_promotion(booking_id: int, db: Session = Depends(get_db)):
    """
    User Function: Remove Promotion from Booking
    TODO: Database implement (UPDATE Booking SET PromotionID = NULL WHERE BookingID = booking_id)
    """
    return None