from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, SessionLocal
from typing import List
from datetime import date
import hashlib
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


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def serialize_user_row(row) -> dict:
    return {
        "UID": row["UID"],
        "Username": row["Username"],
        "UName": row["UName"],
        "UEmail": row["UEmail"],
        "UPhoneNumber": row["UPhoneNumber"],
    }


def generate_standard_seat_layout(theater_id: int) -> list[dict]:
    layout = []
    rows = [chr(code) for code in range(ord("A"), ord("L") + 1)]
    seat_id = 1

    for row in rows:
        is_premium_row = row in {"I", "J", "K", "L"}
        seat_type = "VIP" if is_premium_row else "Regular"
        price = 250.00 if is_premium_row else 200.00

        for seat_number in range(1, 9):
            layout.append(
                {
                    "SeatID": theater_id * 1000 + seat_id,
                    "SeatStatus": "Available",
                    "SeatRow": row,
                    "SeatNumber": seat_number,
                    "SeatType": seat_type,
                    "ThID": theater_id,
                    "Price": price,
                }
            )
            seat_id += 1

    return layout


def get_standard_seat_meta(seat_row: str, seat_number: int, theater_id: int) -> dict | None:
    normalized_row = seat_row.strip().upper()

    for seat in generate_standard_seat_layout(theater_id):
        if seat["SeatRow"] == normalized_row and seat["SeatNumber"] == seat_number:
            return seat

    return None

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


@app.post("/api/users/register", response_model=schemas.UserResponse, tags=["User - Auth"], status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    User Function: Register new user
    """
    existing_user = db.execute(
        text(
            """
            SELECT UID, Username, UEmail, UPhoneNumber
            FROM `User`
            WHERE Username = :username
               OR UEmail = :email
               OR UPhoneNumber = :phone
            """
        ),
        {
            "username": user.Username,
            "email": user.UEmail,
            "phone": user.UPhoneNumber,
        },
    ).mappings().first()

    if existing_user:
        if existing_user["Username"] == user.Username:
            raise HTTPException(status_code=409, detail="Username already exists")
        if existing_user["UEmail"] == user.UEmail:
            raise HTTPException(status_code=409, detail="Email already exists")
        if existing_user["UPhoneNumber"] == user.UPhoneNumber:
            raise HTTPException(status_code=409, detail="Phone number already exists")

    result = db.execute(
        text(
            """
            INSERT INTO `User` (Username, UName, UPassword, UEmail, UPhoneNumber)
            VALUES (:username, :name, :password, :email, :phone)
            """
        ),
        {
            "username": user.Username,
            "name": user.UName,
            "password": hash_password(user.UPassword),
            "email": user.UEmail,
            "phone": user.UPhoneNumber,
        },
    )
    db.commit()

    created_user = db.execute(
        text(
            """
            SELECT UID, Username, UName, UEmail, UPhoneNumber
            FROM `User`
            WHERE UID = :uid
            """
        ),
        {"uid": result.lastrowid},
    ).mappings().first()

    if not created_user:
        raise HTTPException(status_code=500, detail="User registration failed")

    return serialize_user_row(created_user)


@app.post("/api/users/signin", response_model=schemas.UserSigninResponse, tags=["User - Auth"])
def signin_user(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    User Function: Sign in with username or email
    """
    if not credentials.Username and not credentials.UEmail:
        raise HTTPException(status_code=400, detail="Username or email is required")

    user = db.execute(
        text(
            """
            SELECT UID, Username, UName, UPassword, UEmail, UPhoneNumber
            FROM `User`
            WHERE Username = :username OR UEmail = :email
            LIMIT 1
            """
        ),
        {
            "username": credentials.Username,
            "email": credentials.UEmail,
        },
    ).mappings().first()

    if not user or user["UPassword"] != hash_password(credentials.UPassword):
        raise HTTPException(status_code=401, detail="Invalid username/email or password")

    return {
        "success": True,
        "user": serialize_user_row(user),
    }


@app.put("/api/users/{uid}", response_model=schemas.UserResponse, tags=["User - Auth"])
def update_user_profile(uid: int, user: schemas.UserUpdate, db: Session = Depends(get_db)):
    """
    User Function: Update user profile
    """
    existing_user = db.execute(
        text(
            """
            SELECT UID, Username, UEmail, UPhoneNumber
            FROM `User`
            WHERE UID = :uid
            """
        ),
        {"uid": uid},
    ).mappings().first()

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    duplicate_user = db.execute(
        text(
            """
            SELECT UID, Username, UEmail, UPhoneNumber
            FROM `User`
            WHERE UID <> :uid
              AND (
                Username = :username
                OR UEmail = :email
                OR UPhoneNumber = :phone
              )
            LIMIT 1
            """
        ),
        {
            "uid": uid,
            "username": user.Username,
            "email": user.UEmail,
            "phone": user.UPhoneNumber,
        },
    ).mappings().first()

    if duplicate_user:
        if duplicate_user["Username"] == user.Username:
            raise HTTPException(status_code=409, detail="Username already exists")
        if duplicate_user["UEmail"] == user.UEmail:
            raise HTTPException(status_code=409, detail="Email already exists")
        if duplicate_user["UPhoneNumber"] == user.UPhoneNumber:
            raise HTTPException(status_code=409, detail="Phone number already exists")

    db.execute(
        text(
            """
            UPDATE `User`
            SET Username = :username,
                UName = :name,
                UEmail = :email,
                UPhoneNumber = :phone
            WHERE UID = :uid
            """
        ),
        {
            "uid": uid,
            "username": user.Username,
            "name": user.UName,
            "email": user.UEmail,
            "phone": user.UPhoneNumber,
        },
    )
    db.commit()

    updated_user = db.execute(
        text(
            """
            SELECT UID, Username, UName, UEmail, UPhoneNumber
            FROM `User`
            WHERE UID = :uid
            """
        ),
        {"uid": uid},
    ).mappings().first()

    if not updated_user:
        raise HTTPException(status_code=500, detail="User update failed")

    return serialize_user_row(updated_user)

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
    query = """
        SELECT
            MID,
            MName,
            Genre,
            Duration,
            AgeRating,
            Description,
            ReleaseDate,
            Actor,
            Director,
            ScoreRating,
            AID
        FROM Movie
        WHERE 1 = 1
    """

    params = {}

    if name:
        query += " AND MName LIKE :name"
        params["name"] = f"%{name}%"

    if date:
        query += " AND ReleaseDate = :release_date"
        params["release_date"] = date

    query += " ORDER BY ReleaseDate DESC, MID DESC"

    movies = db.execute(text(query), params).mappings().all()
    return [dict(movie) for movie in movies]

@app.get("/api/movies/{movie_id}", response_model=schemas.MovieResponse, tags=["User - Cinema"])
def get_movie_by_id(movie_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Movie Detail by ID
    TODO: Database implement (SELECT * FROM Movie WHERE MID = movie_id)
    """
    movie = db.execute(
        text(
            """
            SELECT
                MID,
                MName,
                Genre,
                Duration,
                AgeRating,
                Description,
                ReleaseDate,
                Actor,
                Director,
                ScoreRating,
                AID
            FROM Movie
            WHERE MID = :movie_id
            """
        ),
        {"movie_id": movie_id},
    ).mappings().first()

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return dict(movie)

@app.get("/api/movies/{movie_id}/showtimes", response_model=List[schemas.MovieShowtimeDateGroupResponse], tags=["User - Cinema"])
def get_showtimes_by_movie_id(movie_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get all showtimes for one movie
    TODO: Database implement (SELECT showtimes + theater + branch WHERE MID = movie_id)
    """
    movie_exists = db.execute(
        text("SELECT MID FROM Movie WHERE MID = :movie_id"),
        {"movie_id": movie_id},
    ).first()

    if not movie_exists:
        raise HTTPException(status_code=404, detail="Movie not found")

    rows = db.execute(
        text(
            """
            SELECT
                s.ShowDate,
                s.ShowtimeID,
                TIME_FORMAT(s.StartTime, '%H:%i') AS StartTime,
                TIME_FORMAT(s.EndTime, '%H:%i') AS EndTime,
                b.BID,
                b.BName,
                b.BLocation,
                t.ThID,
                t.ThNumber,
                t.ThType
            FROM Showtime s
            JOIN Theater t ON s.ThID = t.ThID
            JOIN Branch b ON t.BID = b.BID
            WHERE s.MID = :movie_id
            ORDER BY s.ShowDate ASC, b.BID ASC, t.ThNumber ASC, s.StartTime ASC
            """
        ),
        {"movie_id": movie_id},
    ).mappings().all()

    grouped_by_date = {}

    for row in rows:
        show_date_key = row["ShowDate"].isoformat()
        date_group = grouped_by_date.setdefault(
            show_date_key,
            {
                "ShowDate": row["ShowDate"],
                "Branches": {},
            },
        )

        branch_group = date_group["Branches"].setdefault(
            row["BID"],
            {
                "BID": row["BID"],
                "BName": row["BName"],
                "BLocation": row["BLocation"],
                "Theaters": {},
            },
        )

        theater_group = branch_group["Theaters"].setdefault(
            row["ThID"],
            {
                "ThID": row["ThID"],
                "ThName": f"Theater {int(row['ThNumber']):02d}",
                "Format": row["ThType"],
                "Showtimes": [],
            },
        )

        theater_group["Showtimes"].append(
            {
                "ShowtimeID": row["ShowtimeID"],
                "StartTime": row["StartTime"],
                "EndTime": row["EndTime"],
                "Language": "EN / TH",
            }
        )

    response = []
    for date_group in grouped_by_date.values():
        branches = []
        for branch_group in date_group["Branches"].values():
            theaters = list(branch_group["Theaters"].values())
            branches.append(
                {
                    "BID": branch_group["BID"],
                    "BName": branch_group["BName"],
                    "BLocation": branch_group["BLocation"],
                    "Theaters": theaters,
                }
            )

        response.append(
            {
                "ShowDate": date_group["ShowDate"],
                "Branches": branches,
            }
        )

    return response

@app.get("/api/showtimes/{showtime_id}/seats", response_model=List[schemas.SeatResponse], tags=["User - Cinema"])
def check_available_seats(showtime_id: int, db: Session = Depends(get_db)):
    """
    User Function: Check Available Seat
    TODO: Database implement (SELECT * FROM Seat WHERE ThID = ...)
    """
    showtime = db.execute(
        text(
            """
            SELECT ShowtimeID, ThID
            FROM Showtime
            WHERE ShowtimeID = :showtime_id
            """
        ),
        {"showtime_id": showtime_id},
    ).mappings().first()

    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")

    base_layout = generate_standard_seat_layout(showtime["ThID"])

    booked_seats = db.execute(
        text(
            """
            SELECT
                s.SeatRow,
                s.SeatNumber
            FROM Ticket t
            JOIN Booking b ON t.BookingID = b.BookingID
            JOIN Seat s ON t.SeatID = s.SeatID
            WHERE b.ShowtimeID = :showtime_id
            """
        ),
        {"showtime_id": showtime_id},
    ).mappings().all()

    booked_lookup = {
        (seat["SeatRow"], seat["SeatNumber"])
        for seat in booked_seats
    }

    for seat in base_layout:
        if (seat["SeatRow"], seat["SeatNumber"]) in booked_lookup:
            seat["SeatStatus"] = "Booked"

    return base_layout

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
    User Function: Create Booking and Tickets
    """
    if not booking.Seats:
        raise HTTPException(status_code=400, detail="At least one seat is required")

    showtime = db.execute(
        text(
            """
            SELECT ShowtimeID, ThID
            FROM Showtime
            WHERE ShowtimeID = :showtime_id
            """
        ),
        {"showtime_id": booking.ShowtimeID},
    ).mappings().first()

    if not showtime:
        raise HTTPException(status_code=404, detail="Showtime not found")

    user = db.execute(
        text(
            """
            SELECT UID
            FROM `User`
            WHERE UID = :uid
            """
        ),
        {"uid": booking.UID},
    ).mappings().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    theater_id = showtime["ThID"]
    normalized_seats = []
    seen_seats = set()

    for seat in booking.Seats:
        normalized_row = seat.SeatRow.strip().upper()
        seat_key = (normalized_row, seat.SeatNumber)

        if seat_key in seen_seats:
            raise HTTPException(status_code=400, detail="Duplicate seats are not allowed")

        seat_meta = get_standard_seat_meta(normalized_row, seat.SeatNumber, theater_id)
        if not seat_meta:
            raise HTTPException(
                status_code=400,
                detail=f"Seat {normalized_row}{seat.SeatNumber} is outside the standard layout",
            )

        seen_seats.add(seat_key)
        normalized_seats.append(
            {
                "SeatRow": normalized_row,
                "SeatNumber": seat.SeatNumber,
                "SeatType": seat_meta["SeatType"],
                "Price": seat_meta["Price"],
            }
        )

    seat_records = []
    total_price = sum(seat["Price"] for seat in normalized_seats)

    try:
        for seat in normalized_seats:
            existing_seat = db.execute(
                text(
                    """
                    SELECT SeatID, SeatStatus, SeatType
                    FROM Seat
                    WHERE ThID = :theater_id
                      AND SeatRow = :seat_row
                      AND SeatNumber = :seat_number
                    ORDER BY SeatID ASC
                    LIMIT 1
                    """
                ),
                {
                    "theater_id": theater_id,
                    "seat_row": seat["SeatRow"],
                    "seat_number": seat["SeatNumber"],
                },
            ).mappings().first()

            if existing_seat:
                if existing_seat["SeatStatus"] == "Unavailable":
                    raise HTTPException(
                        status_code=409,
                        detail=f"Seat {seat['SeatRow']}{seat['SeatNumber']} is unavailable",
                    )

                seat_records.append(
                    {
                        "SeatID": existing_seat["SeatID"],
                        "SeatRow": seat["SeatRow"],
                        "SeatNumber": seat["SeatNumber"],
                        "Price": seat["Price"],
                    }
                )
                continue

            created_seat = db.execute(
                text(
                    """
                    INSERT INTO Seat (SeatStatus, SeatRow, SeatNumber, SeatType, ThID)
                    VALUES ('Available', :seat_row, :seat_number, :seat_type, :theater_id)
                    """
                ),
                {
                    "seat_row": seat["SeatRow"],
                    "seat_number": seat["SeatNumber"],
                    "seat_type": seat["SeatType"],
                    "theater_id": theater_id,
                },
            )

            seat_records.append(
                {
                    "SeatID": created_seat.lastrowid,
                    "SeatRow": seat["SeatRow"],
                    "SeatNumber": seat["SeatNumber"],
                    "Price": seat["Price"],
                }
            )

        booked_seat = None
        if seat_records:
            seat_conditions = []
            seat_params = {"showtime_id": booking.ShowtimeID}

            for index, seat in enumerate(seat_records):
                seat_conditions.append(
                    f"(s.SeatRow = :seat_row_{index} AND s.SeatNumber = :seat_number_{index})"
                )
                seat_params[f"seat_row_{index}"] = seat["SeatRow"]
                seat_params[f"seat_number_{index}"] = seat["SeatNumber"]

            booked_seat = db.execute(
                text(
                    f"""
                    SELECT s.SeatRow, s.SeatNumber
                    FROM Ticket t
                    JOIN Booking b ON t.BookingID = b.BookingID
                    JOIN Seat s ON t.SeatID = s.SeatID
                    WHERE b.ShowtimeID = :showtime_id
                      AND ({' OR '.join(seat_conditions)})
                    LIMIT 1
                    """
                ),
                seat_params,
            ).mappings().first()

        if booked_seat:
            raise HTTPException(
                status_code=409,
                detail=f"Seat {booked_seat['SeatRow']}{booked_seat['SeatNumber']} has already been booked",
            )

        booking_result = db.execute(
            text(
                """
                INSERT INTO Booking (BookingStatus, BookingDate, TotalPrice, UID, ShowtimeID, PromotionID)
                VALUES ('Confirmed', :booking_date, :total_price, :uid, :showtime_id, NULL)
                """
            ),
            {
                "booking_date": date.today(),
                "total_price": total_price,
                "uid": booking.UID,
                "showtime_id": booking.ShowtimeID,
            },
        )

        booking_id = booking_result.lastrowid

        for seat in seat_records:
            db.execute(
                text(
                    """
                    INSERT INTO Ticket (Price, BookingID, SeatID)
                    VALUES (:price, :booking_id, :seat_id)
                    """
                ),
                {
                    "price": seat["Price"],
                    "booking_id": booking_id,
                    "seat_id": seat["SeatID"],
                },
            )

        db.commit()
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Booking creation failed: {str(exc)}")

    created_booking = db.execute(
        text(
            """
            SELECT BookingID, BookingDate, BookingStatus, TotalPrice, UID, ShowtimeID, PromotionID
            FROM Booking
            WHERE BookingID = :booking_id
            """
        ),
        {"booking_id": booking_id},
    ).mappings().first()

    if not created_booking:
        raise HTTPException(status_code=500, detail="Booking was created but could not be retrieved")

    return created_booking

@app.get("/api/bookings/{booking_id}", response_model=schemas.BookingResponse, tags=["User - Booking"])
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Booking Details
    """
    booking = db.execute(
        text(
            """
            SELECT BookingID, BookingDate, BookingStatus, TotalPrice, UID, ShowtimeID, PromotionID
            FROM Booking
            WHERE BookingID = :booking_id
            """
        ),
        {"booking_id": booking_id},
    ).mappings().first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    return booking


@app.get("/api/users/{uid}/bookings", response_model=List[schemas.UserBookingHistoryResponse], tags=["User - Booking"])
def get_user_bookings(uid: int, db: Session = Depends(get_db)):
    """
    User Function: Get all bookings for one user with ticket, seat, showtime, movie, theater, and branch details
    """
    user = db.execute(
        text(
            """
            SELECT UID
            FROM `User`
            WHERE UID = :uid
            """
        ),
        {"uid": uid},
    ).mappings().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    rows = db.execute(
        text(
            """
            SELECT
                b.BookingID,
                b.BookingDate,
                b.BookingStatus,
                b.TotalPrice,
                b.UID,
                b.ShowtimeID,
                b.PromotionID,
                m.MID,
                m.MName,
                s.ShowDate,
                TIME_FORMAT(s.StartTime, '%H:%i') AS StartTime,
                TIME_FORMAT(s.EndTime, '%H:%i') AS EndTime,
                br.BID,
                br.BName,
                br.BLocation,
                t.ThID,
                t.ThNumber,
                t.ThType,
                tk.TicketID,
                tk.SeatID,
                tk.Price,
                st.SeatRow,
                st.SeatNumber,
                r.ReviewID,
                r.ReviewDate,
                r.ReviewScore,
                r.Comment
            FROM Booking b
            JOIN Showtime s ON b.ShowtimeID = s.ShowtimeID
            JOIN Movie m ON s.MID = m.MID
            JOIN Theater t ON s.ThID = t.ThID
            JOIN Branch br ON t.BID = br.BID
            JOIN Ticket tk ON b.BookingID = tk.BookingID
            JOIN Seat st ON tk.SeatID = st.SeatID
            LEFT JOIN Review r ON r.UID = b.UID AND r.MID = m.MID
            WHERE b.UID = :uid
            ORDER BY s.ShowDate DESC, s.StartTime DESC, b.BookingID DESC, st.SeatRow ASC, st.SeatNumber ASC
            """
        ),
        {"uid": uid},
    ).mappings().all()

    bookings: dict[int, dict] = {}

    for row in rows:
        booking_id = row["BookingID"]

        if booking_id not in bookings:
            bookings[booking_id] = {
                "BookingID": row["BookingID"],
                "BookingDate": row["BookingDate"],
                "BookingStatus": row["BookingStatus"],
                "TotalPrice": row["TotalPrice"],
                "UID": row["UID"],
                "ShowtimeID": row["ShowtimeID"],
                "PromotionID": row["PromotionID"],
                "MID": row["MID"],
                "MName": row["MName"],
                "ShowDate": row["ShowDate"],
                "StartTime": row["StartTime"],
                "EndTime": row["EndTime"],
                "BID": row["BID"],
                "BName": row["BName"],
                "BLocation": row["BLocation"],
                "ThID": row["ThID"],
                "ThNumber": row["ThNumber"],
                "ThType": row["ThType"],
                "Seats": [],
                "Review": None,
            }

            if row["ReviewID"] is not None:
                bookings[booking_id]["Review"] = {
                    "ReviewID": row["ReviewID"],
                    "ReviewDate": row["ReviewDate"],
                    "ReviewScore": row["ReviewScore"],
                    "Comment": row["Comment"],
                }

        bookings[booking_id]["Seats"].append(
            {
                "TicketID": row["TicketID"],
                "SeatID": row["SeatID"],
                "SeatRow": row["SeatRow"],
                "SeatNumber": row["SeatNumber"],
                "Price": row["Price"],
            }
        )

    return list(bookings.values())

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
    User Function: Create Review and update movie average score
    """
    user = db.execute(
        text(
            """
            SELECT UID
            FROM `User`
            WHERE UID = :uid
            """
        ),
        {"uid": review.UID},
    ).mappings().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    movie = db.execute(
        text(
            """
            SELECT MID
            FROM Movie
            WHERE MID = :mid
            """
        ),
        {"mid": review.MID},
    ).mappings().first()

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    watched_booking = db.execute(
        text(
            """
            SELECT b.BookingID
            FROM Booking b
            JOIN Showtime s ON b.ShowtimeID = s.ShowtimeID
            WHERE b.UID = :uid
              AND s.MID = :mid
              AND TIMESTAMP(s.ShowDate, s.StartTime) < NOW()
            LIMIT 1
            """
        ),
        {
            "uid": review.UID,
            "mid": review.MID,
        },
    ).mappings().first()

    if not watched_booking:
        raise HTTPException(status_code=403, detail="You can review only watched movies")

    existing_review = db.execute(
        text(
            """
            SELECT ReviewID
            FROM Review
            WHERE UID = :uid
              AND MID = :mid
            LIMIT 1
            """
        ),
        {
            "uid": review.UID,
            "mid": review.MID,
        },
    ).mappings().first()

    if existing_review:
        raise HTTPException(status_code=409, detail="You have already reviewed this movie")

    try:
        review_result = db.execute(
            text(
                """
                INSERT INTO Review (ReviewDate, ReviewScore, Comment, UID, MID)
                VALUES (:review_date, :review_score, :comment, :uid, :mid)
                """
            ),
            {
                "review_date": date.today(),
                "review_score": review.ReviewScore,
                "comment": review.Comment.strip() if review.Comment else None,
                "uid": review.UID,
                "mid": review.MID,
            },
        )

        average_row = db.execute(
            text(
                """
                SELECT ROUND(AVG(ReviewScore), 1) AS AverageScore
                FROM Review
                WHERE MID = :mid
                """
            ),
            {"mid": review.MID},
        ).mappings().first()

        average_score = average_row["AverageScore"] if average_row and average_row["AverageScore"] is not None else 0

        db.execute(
            text(
                """
                UPDATE Movie
                SET ScoreRating = :score_rating
                WHERE MID = :mid
                """
            ),
            {
                "score_rating": average_score,
                "mid": review.MID,
            },
        )

        db.commit()
    except HTTPException:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Review creation failed: {str(exc)}")

    created_review = db.execute(
        text(
            """
            SELECT ReviewID, ReviewDate, ReviewScore, Comment, UID, MID
            FROM Review
            WHERE ReviewID = :review_id
            """
        ),
        {"review_id": review_result.lastrowid},
    ).mappings().first()

    if not created_review:
        raise HTTPException(status_code=500, detail="Review was created but could not be retrieved")

    return created_review

@app.get("/api/reviews/{movie_id}", response_model=List[schemas.ReviewResponse], tags=["User - Review"])
def get_reviews_by_movie(movie_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Reviews by Movie
    """
    reviews = db.execute(
        text(
            """
            SELECT ReviewID, ReviewDate, ReviewScore, Comment, UID, MID
            FROM Review
            WHERE MID = :movie_id
            ORDER BY ReviewDate DESC, ReviewID DESC
            """
        ),
        {"movie_id": movie_id},
    ).mappings().all()

    return reviews

@app.get("/api/reviews/user/{user_id}", response_model=List[schemas.ReviewResponse], tags=["User - Review"])
def get_reviews_by_user(user_id: int, db: Session = Depends(get_db)):
    """
    User Function: Get Reviews by User
    """
    reviews = db.execute(
        text(
            """
            SELECT ReviewID, ReviewDate, ReviewScore, Comment, UID, MID
            FROM Review
            WHERE UID = :user_id
            ORDER BY ReviewDate DESC, ReviewID DESC
            """
        ),
        {"user_id": user_id},
    ).mappings().all()

    return reviews

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
