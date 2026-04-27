from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from database import engine
from typing import List
import schemas
app = FastAPI()

@app.get("/api/db-test")
def db_test():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"message": "MySQL connected successfully"}

# Admin Endpoints
# Add, Edit, Delete for Movie
@app.post("/api/admin/movies", response_model=schemas.MovieResponse, tags=["Admin - Movie"])
def create_movie(movie: schemas.MovieCreate):
    """
    Admin Function: Add Movie
    """
    # TODO: Connect to DB and INSERT record
    # Mocking ID for now
    return {**movie.model_dump(), "MID": 999}

@app.put("/api/admin/movies/{movie_id}", response_model=schemas.MovieResponse, tags=["Admin - Movie"])
def update_movie(movie_id: int, movie: schemas.MovieUpdate):
    """
    Admin Function: Edit Movie
    """
    # TODO: Connect to DB and UPDATE record WHERE MID = movie_id
    # Mocking response
    return {
        "MID": movie_id,
        "MName": movie.MName or "Updated Name",
        "Genre": movie.Genre or "Action",
        "Duration": movie.Duration or 120,
        "AgeRating": movie.AgeRating or "G",
        "ReleaseDate": movie.ReleaseDate or "2026-01-01",
        "AID": 1
    }

@app.delete("/api/admin/movies/{movie_id}", tags=["Admin - Movie"])
def delete_movie(movie_id: int):
    """
    Admin Function: Delete Movie
    """
    # TODO: Connect to DB and DELETE record WHERE MID = movie_id
    return {"message": f"Movie {movie_id} deleted successfully"}

# Admin Endpoints
# Add, Edit, Delete for Showtime
@app.post("/api/admin/showtimes", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"])
def create_showtime(showtime: schemas.ShowtimeCreate):
    """
    Admin Function: Add Showtime
    """
    # TODO: Connect to DB and INSERT record
    return {**showtime.model_dump(), "ShowtimeID": 888}

@app.put("/api/admin/showtimes/{showtime_id}", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"])
def update_showtime(showtime_id: int, showtime: schemas.ShowtimeCreate):
    """
    Admin Function: Edit Showtime
    """
    # TODO: Connect to DB and UPDATE record WHERE ShowtimeID = showtime_id
    return {**showtime.model_dump(), "ShowtimeID": showtime_id}

@app.delete("/api/admin/showtimes/{showtime_id}", tags=["Admin - Showtime"])
def delete_showtime(showtime_id: int):
    """
    Admin Function: Delete Showtime
    """
    # TODO: Connect to DB and DELETE record WHERE ShowtimeID = showtime_id
    return {"message": f"Showtime {showtime_id} deleted successfully"}

# user endpoints

@app.get("/api/movies", response_model=List[schemas.MovieResponse], tags=["User - Cinema"])
def search_movies(name: str = None, date: str = None, branch: str = None):
    """
    User Function: Search Movie and Showtime
    """
    # TODO: Connect to DB and SELECT with filters
    return [
        # example from report
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
def check_available_seats(showtime_id: int):
    """
    User Function: Check Available Seat)
    """
    # TODO: Connect to DB and SELECT * FROM Seat WHERE ThID = ...
    return [
        {
            "SeatID": 5001,
            "SeatStatus": "Available",
            "SeatRow": "A",
            "SeatNumber": 12,
            "SeatType": "Standard",
            "ThID": 101
        },
        {
            "SeatID": 5002,
            "SeatStatus": "Booked",
            "SeatRow": "A",
            "SeatNumber": 13,
            "SeatType": "Standard",
            "ThID": 101
        }
    ]
