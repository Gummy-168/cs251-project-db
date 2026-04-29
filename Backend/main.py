from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, SessionLocal
from typing import List
from decimal import Decimal
import models, schemas

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

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
    """
    db_movie = models.Movie(**movie.model_dump())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie) 
    return db_movie

@app.put("/api/admin/movies/{movie_id}", response_model=schemas.MovieResponse, tags=["Admin - Movie"])
def update_movie(movie_id: int, movie: schemas.MovieUpdate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Movie
    """
    db_movie = db.query(models.Movie).filter(models.Movie.MID == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail=f"Movie ID {movie_id} not found")
    
    for field, value in movie.model_dump(exclude_unset=True).items():
        setattr(db_movie, field, value)
    
    db.commit()
    db.refresh(db_movie)
    return db_movie

@app.delete("/api/admin/movies/{movie_id}", tags=["Admin - Movie"], status_code=status.HTTP_204_NO_CONTENT)
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Movie
    """
    db_movie = db.query(models.Movie).filter(models.Movie.MID == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail=f"Movie ID {movie_id} not found")
    
    db.delete(db_movie)
    db.commit()
    return None

# Admin Endpoints - Showtime

@app.post("/api/admin/showtimes", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"], status_code=status.HTTP_201_CREATED)
def create_showtime(showtime: schemas.ShowtimeCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Showtime
    """
    #check if movie and theater exist
    if not db.query(models.Movie).filter(models.Movie.MID == showtime.MID).first():
        raise HTTPException(status_code=404, detail=f"Movie ID {showtime.MID} not found")
    if not db.query(models.Theater).filter(models.Theater.ThID == showtime.ThID).first():
        raise HTTPException(status_code=404, detail=f"Theater ID {showtime.ThID} not found")

    db_showtime = models.Showtime(**showtime.model_dump())
    db.add(db_showtime)
    db.commit()
    db.refresh(db_showtime)
    return db_showtime

@app.put("/api/admin/showtimes/{showtime_id}", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"])
def update_showtime(showtime_id: int, showtime: schemas.ShowtimeCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Showtime
    """
    db_showtime = db.query(models.Showtime).filter(models.Showtime.ShowtimeID == showtime_id).first()
    if not db_showtime:
        raise HTTPException(status_code=404, detail=f"Showtime ID {showtime_id} not found")

    for field, value in showtime.model_dump(exclude_unset=True).items():
        setattr(db_showtime, field, value)

    db.commit()
    db.refresh(db_showtime)
    return db_showtime

@app.delete("/api/admin/showtimes/{showtime_id}", tags=["Admin - Showtime"], status_code=status.HTTP_204_NO_CONTENT)
def delete_showtime(showtime_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Showtime
    """
    db_showtime = db.query(models.Showtime).filter(models.Showtime.ShowtimeID == showtime_id).first()
    if not db_showtime:
        raise HTTPException(status_code=404, detail=f"Showtime ID {showtime_id} not found")

    db.delete(db_showtime)
    db.commit()
    return None

# Admin Endpoints - Branch

@app.post("/api/admin/branches", response_model=schemas.BranchResponse, tags=["Admin - Branch"], status_code=status.HTTP_201_CREATED)
def create_branch(branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Branch
    """
    db_branch = models.Branch(**branch.model_dump())
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    return db_branch

@app.put("/api/admin/branches/{branch_id}", response_model=schemas.BranchResponse, tags=["Admin - Branch"])
def update_branch(branch_id: int, branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Branch
    """
    db_branch = db.query(models.Branch).filter(models.Branch.BID == branch_id).first()
    if not db_branch:
        raise HTTPException(status_code=404, detail=f"Branch ID {branch_id} not found")

    for field, value in branch.model_dump(exclude_unset=True).items():
        setattr(db_branch, field, value)

    db.commit()
    db.refresh(db_branch)
    return db_branch

@app.delete("/api/admin/branches/{branch_id}", tags=["Admin - Branch"], status_code=status.HTTP_204_NO_CONTENT)
def delete_branch(branch_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Branch
    """
    db_branch = db.query(models.Branch).filter(models.Branch.BID == branch_id).first()
    if not db_branch:
        raise HTTPException(status_code=404, detail=f"Branch ID {branch_id} not found")

    db.delete(db_branch)
    db.commit()
    return None

# Admin Endpoints - Theater

@app.post("/api/admin/theaters", response_model=schemas.TheaterResponse, tags=["Admin - Theater"], status_code=status.HTTP_201_CREATED)
def create_theater(theater: schemas.TheaterCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Theater
    """
    if not db.query(models.Branch).filter(models.Branch.BID == theater.BID).first():
        raise HTTPException(status_code=404, detail=f"Branch ID {theater.BID} not found")

    db_theater = models.Theater(**theater.model_dump())
    db.add(db_theater)
    db.commit()
    db.refresh(db_theater)
    return db_theater

@app.put("/api/admin/theaters/{theater_id}", response_model=schemas.TheaterResponse, tags=["Admin - Theater"])
def update_theater(theater_id: int, theater: schemas.TheaterCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Theater
    """
    db_theater = db.query(models.Theater).filter(models.Theater.ThID == theater_id).first()
    if not db_theater:
        raise HTTPException(status_code=404, detail=f"Theater ID {theater_id} not found")

    for field, value in theater.model_dump(exclude_unset=True).items():
        setattr(db_theater, field, value)

    db.commit()
    db.refresh(db_theater)
    return db_theater

@app.delete("/api/admin/theaters/{theater_id}", tags=["Admin - Theater"], status_code=status.HTTP_204_NO_CONTENT)
def delete_theater(theater_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Theater
    """
    db_theater = db.query(models.Theater).filter(models.Theater.ThID == theater_id).first()
    if not db_theater:
        raise HTTPException(status_code=404, detail=f"Theater ID {theater_id} not found")

    db.delete(db_theater)
    db.commit()
    return None

# Admin Endpoints - Seat

@app.post("/api/admin/seats", response_model=schemas.SeatResponse, tags=["Admin - Seat"], status_code=status.HTTP_201_CREATED)
def create_seat(seat: schemas.SeatCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Seat
    """
    if not db.query(models.Theater).filter(models.Theater.ThID == seat.ThID).first():
        raise HTTPException(status_code=404, detail=f"Theater ID {seat.ThID} not found")

    db_seat = models.Seat(**seat.model_dump())
    db.add(db_seat)
    db.commit()
    db.refresh(db_seat)
    return db_seat

@app.put("/api/admin/seats/{seat_id}", response_model=schemas.SeatResponse, tags=["Admin - Seat"])
def update_seat(seat_id: int, seat: schemas.SeatCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Seat
    """
    db_seat = db.query(models.Seat).filter(models.Seat.SeatID == seat_id).first()
    if not db_seat:
        raise HTTPException(status_code=404, detail=f"Seat ID {seat_id} not found")

    for field, value in seat.model_dump(exclude_unset=True).items():
        setattr(db_seat, field, value)

    db.commit()
    db.refresh(db_seat)
    return db_seat

@app.delete("/api/admin/seats/{seat_id}", tags=["Admin - Seat"], status_code=status.HTTP_204_NO_CONTENT)
def delete_seat(seat_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Seat
    """
    db_seat = db.query(models.Seat).filter(models.Seat.SeatID == seat_id).first()
    if not db_seat:
        raise HTTPException(status_code=404, detail=f"Seat ID {seat_id} not found")

    db.delete(db_seat)
    db.commit()
    return None

# Admin Endpoints - Payment

@app.get("/api/admin/payments/{payment_id}", response_model=schemas.PaymentResponse, tags=["Admin - Payment"])
def get_payment_record(payment_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Retrieve payment details by PaymentID
    TODO: Database implement
    """
    # MOCK DATA: Replace with real database output
    return {**models.Payment.model_dump(), "PaymentID": payment_id}


# user endpoints

@app.get("/api/movies", response_model=List[schemas.MovieResponse], tags=["User - Cinema"])
def search_movies(name: str = None, date: str = None, branch: str = None, db: Session = Depends(get_db)):
    """
    User Function: Search Movie and Showtime
    - name   : กรองตามชื่อหนัง (ค้นหาแบบ contains)
    - date   : กรองตาม ShowDate ของ Showtime (YYYY-MM-DD)
    - branch : กรองตามชื่อ Branch (ค้นหาแบบ contains)
    """
    query = db.query(models.Movie)
    if name:
        query = query.filter(models.Movie.MName.contains(name))

    if date or branch:
        # JOIN ไปที่ Showtime → Theater → Branch เมื่อมีการกรองด้วย date หรือ branch
        query = query.join(models.Showtime, models.Movie.MID == models.Showtime.MID)

        if date:
            query = query.filter(models.Showtime.ShowDate == date)

        if branch:
            query = (
                query
                .join(models.Theater, models.Showtime.ThID == models.Theater.ThID)
                .join(models.Branch, models.Theater.BID == models.Branch.BID)
                .filter(models.Branch.BName.contains(branch))
            )

    return query.distinct().all()

@app.get("/api/showtimes/{showtime_id}/seats", response_model=List[schemas.SeatResponse], tags=["User - Cinema"])
def check_available_seats(showtime_id: int, db: Session = Depends(get_db)):
    """
    User Function: Check Available Seat
    ดึง Seat ทั้งหมดของ Theater ที่ผูกกับ Showtime นั้น
    """
    db_showtime = db.query(models.Showtime).filter(models.Showtime.ShowtimeID == showtime_id).first()
    if not db_showtime:
        raise HTTPException(status_code=404, detail=f"Showtime ID {showtime_id} not found")

    seats = db.query(models.Seat).filter(models.Seat.ThID == db_showtime.ThID).all()
    return seats

# User Endpoints - Payment

@app.get("/api/payments/{payment_id}", response_model=schemas.PaymentResponse, tags=["Payment"])
def buy_ticket(payment_id: int, db: Session = Depends(get_db)):
    """
    User Function: Buy Ticket
    TODO: Database implement (INSERT INTO Payment -> return PaymentID)
    """
    # MOCK DATA: Replace with real database output
    return {**models.Payment.model_dump(), "PaymentID": payment_id}

# User Endpoints - Booking

@app.get("/api/bookings", response_model=schemas.BookingResponse, tags=["Booking"], status_code=status.HTTP_201_CREATED)
def get_booking_record(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    """
    User Function: Get Booking Record
    TODO: Database implement (INSERT INTO Booking -> return BookingID)
    """
    # MOCK DATA: Replace with real database output
    return {**booking.model_dump(), "BookingID": 2001}

# User Endpoints - Ticket

@app.get("/api/tickets/{ticket_id}", response_model=schemas.TicketResponse, tags=["Ticket"])
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Ticket Details
    TODO: Database implement (SELECT * FROM Ticket WHERE TicketID = ticket_id)
    """
    # MOCK DATA: Replace with real database output
    return {**models.Ticket.model_dump(), "TicketID": ticket_id}


# User Endpoints - Review

@app.post("/api/reviews", response_model=schemas.ReviewResponse, tags=["Review"], status_code=status.HTTP_201_CREATED)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    """
    User Function: Create movie review
    """

    # check if user exists
    db_user = db.query(models.User).filter(models.User.id == review.UID).first()
    if not db_user:
        raise HTTPException(status_code=404, detail=f"User ID {review.UID} not found")

    # check if movie exists
    db_movie = db.query(models.Movie).filter(models.Movie.MID == review.MID).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail=f"Movie ID {review.MID} not found")

    # check review score range
    if review.ReviewScore < 1 or review.ReviewScore > 5:
        raise HTTPException(status_code=400, detail="ReviewScore must be between 1 and 5")

    db_review = models.Review(**review.model_dump())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


@app.get("/api/movies/{movie_id}/reviews", response_model=List[schemas.ReviewResponse], tags=["Review"])
def get_reviews_by_movie(movie_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get all reviews of a movie
    """

    db_movie = db.query(models.Movie).filter(models.Movie.MID == movie_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail=f"Movie ID {movie_id} not found")

    reviews = db.query(models.Review).filter(models.Review.MID == movie_id).all()
    return reviews
