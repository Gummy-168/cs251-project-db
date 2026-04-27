from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, SessionLocal
from typing import List
import models, schemas

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
    TODO: Database Team Logic (models.Movie(**movie.model_dump()) -> db.add -> db.commit)
    """
    # MOCK DATA: Replace with real database output
    return {**movie.model_dump(), "MID": 999, "ScoreRating": 0.0, "AID": 1}

@app.put("/api/admin/movies/{movie_id}", response_model=schemas.MovieResponse, tags=["Admin - Movie"])
def update_movie(movie_id: int, movie: schemas.MovieUpdate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Movie
    TODO: Database Team Logic (db.query(models.Movie).update -> db.commit)
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
    TODO: Database Team Logic (db.delete WHERE MID = movie_id)
    """
    # MOCK SUCCESS: Returns empty 204 response
    return None

# Admin Endpoints - Showtime

@app.post("/api/admin/showtimes", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"], status_code=status.HTTP_201_CREATED)
def create_showtime(showtime: schemas.ShowtimeCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Showtime
    TODO: Database Team Logic
    """
    # MOCK DATA: Replace with real database output
    return {**showtime.model_dump(), "ShowtimeID": 888}

@app.put("/api/admin/showtimes/{showtime_id}", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"])
def update_showtime(showtime_id: int, showtime: schemas.ShowtimeCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Showtime
    TODO: Database Team Logic
    """
    # MOCK DATA: Replace with real database output
    return {**showtime.model_dump(), "ShowtimeID": showtime_id}

@app.delete("/api/admin/showtimes/{showtime_id}", tags=["Admin - Showtime"], status_code=status.HTTP_204_NO_CONTENT)
def delete_showtime(showtime_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Showtime
    TODO: Database Team Logic
    """
    return None

# user endpoints

@app.get("/api/movies", response_model=List[schemas.MovieResponse], tags=["User - Cinema"])
def search_movies(name: str = None, date: str = None, branch: str = None, db: Session = Depends(get_db)):
    """
    User Function: Search Movie and Showtime
    TODO: Database Team Logic (SELECT with filters)
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
    TODO: Database Team Logic (SELECT * FROM Seat WHERE ThID = ...)
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
