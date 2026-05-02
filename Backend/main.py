from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, SessionLocal
from typing import List
import hashlib
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


def fetch_one(db: Session, query: str, params: dict | None = None):
    return db.execute(text(query), params or {}).mappings().first()


def ensure_record_exists(
    db: Session,
    table_name: str,
    id_column: str,
    record_id: int,
    detail: str,
) -> None:
    record = fetch_one(
        db,
        f"SELECT {id_column} FROM `{table_name}` WHERE {id_column} = :record_id",
        {"record_id": record_id},
    )
    if not record:
        raise HTTPException(status_code=404, detail=detail)


def seed_initial_data() -> None:
    db = SessionLocal()
    try:
        admin = fetch_one(
            db,
            """
            SELECT AID
            FROM `Admin`
            WHERE AEmail = :email
            LIMIT 1
            """,
            {"email": "admin@cs251.local"},
        )

        if admin:
            admin_id = admin["AID"]
        else:
            admin_result = db.execute(
                text(
                    """
                    INSERT INTO `Admin` (AName, AEmail, APassword)
                    VALUES (:name, :email, :password)
                    """
                ),
                {
                    "name": "System Admin",
                    "email": "admin@cs251.local",
                    "password": hash_password("admin1234"),
                },
            )
            db.commit()
            admin_id = admin_result.lastrowid

        existing_movie = fetch_one(
            db,
            """
            SELECT MID
            FROM `Movie`
            WHERE MName = :name AND AID = :aid
            LIMIT 1
            """,
            {"name": "Welcome Movie", "aid": admin_id},
        )

        if not existing_movie:
            db.execute(
                text(
                    """
                    INSERT INTO `Movie` (
                        MName, Genre, Duration, AgeRating, Description,
                        ReleaseDate, Actor, Director, ScoreRating, AID
                    )
                    VALUES (
                        :name, :genre, :duration, :age_rating, :description,
                        :release_date, :actor, :director, :score_rating, :aid
                    )
                    """
                ),
                {
                    "name": "Welcome Movie",
                    "genre": "Drama",
                    "duration": 120,
                    "age_rating": "G",
                    "description": "Default movie created automatically for a fresh deployment.",
                    "release_date": "2026-01-01",
                    "actor": "Sample Cast",
                    "director": "System Seeder",
                    "score_rating": 0.0,
                    "aid": admin_id,
                },
            )
            db.commit()
    finally:
        db.close()


@app.on_event("startup")
def startup_tasks():
    seed_initial_data()

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
    """
    ensure_record_exists(db, "Admin", "AID", movie.AID, "Admin not found")

    result = db.execute(
        text(
            """
            INSERT INTO `Movie` (
                MName, Genre, Duration, AgeRating, Description,
                ReleaseDate, Actor, Director, ScoreRating, AID
            )
            VALUES (
                :MName, :Genre, :Duration, :AgeRating, :Description,
                :ReleaseDate, :Actor, :Director, :ScoreRating, :AID
            )
            """
        ),
        movie.model_dump(),
    )
    db.commit()

    created_movie = fetch_one(
        db,
        """
        SELECT MID, MName, Genre, Duration, AgeRating, Description,
               ReleaseDate, Actor, Director, ScoreRating, AID
        FROM `Movie`
        WHERE MID = :movie_id
        """,
        {"movie_id": result.lastrowid},
    )
    if not created_movie:
        raise HTTPException(status_code=500, detail="Movie creation failed")

    return dict(created_movie)

@app.put("/api/admin/movies/{movie_id}", response_model=schemas.MovieResponse, tags=["Admin - Movie"])
def update_movie(movie_id: int, movie: schemas.MovieUpdate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Movie
    """
    existing_movie = fetch_one(
        db,
        """
        SELECT MID, MName, Genre, Duration, AgeRating, Description,
               ReleaseDate, Actor, Director, ScoreRating, AID
        FROM `Movie`
        WHERE MID = :movie_id
        """,
        {"movie_id": movie_id},
    )
    if not existing_movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    update_data = movie.model_dump(exclude_unset=True)
    if not update_data:
        return dict(existing_movie)

    set_clause = ", ".join(f"{column} = :{column}" for column in update_data.keys())
    db.execute(
        text(f"UPDATE `Movie` SET {set_clause} WHERE MID = :movie_id"),
        {"movie_id": movie_id, **update_data},
    )
    db.commit()

    updated_movie = fetch_one(
        db,
        """
        SELECT MID, MName, Genre, Duration, AgeRating, Description,
               ReleaseDate, Actor, Director, ScoreRating, AID
        FROM `Movie`
        WHERE MID = :movie_id
        """,
        {"movie_id": movie_id},
    )
    return dict(updated_movie)

@app.delete("/api/admin/movies/{movie_id}", tags=["Admin - Movie"], status_code=status.HTTP_204_NO_CONTENT)
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Movie
    """
    ensure_record_exists(db, "Movie", "MID", movie_id, "Movie not found")
    db.execute(text("DELETE FROM `Movie` WHERE MID = :movie_id"), {"movie_id": movie_id})
    db.commit()
    return None

# Admin Endpoints - Showtime

@app.post("/api/admin/showtimes", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"], status_code=status.HTTP_201_CREATED)
def create_showtime(showtime: schemas.ShowtimeCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Showtime
    """
    ensure_record_exists(db, "Theater", "ThID", showtime.ThID, "Theater not found")
    ensure_record_exists(db, "Movie", "MID", showtime.MID, "Movie not found")

    result = db.execute(
        text(
            """
            INSERT INTO `Showtime` (ShowDate, StartTime, EndTime, ThID, MID)
            VALUES (:ShowDate, :StartTime, :EndTime, :ThID, :MID)
            """
        ),
        showtime.model_dump(),
    )
    db.commit()

    created_showtime = fetch_one(
        db,
        """
        SELECT ShowtimeID, ShowDate, StartTime, EndTime, ThID, MID
        FROM `Showtime`
        WHERE ShowtimeID = :showtime_id
        """,
        {"showtime_id": result.lastrowid},
    )
    return dict(created_showtime)

@app.put("/api/admin/showtimes/{showtime_id}", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"])
def update_showtime(showtime_id: int, showtime: schemas.ShowtimeCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Showtime
    """
    ensure_record_exists(db, "Showtime", "ShowtimeID", showtime_id, "Showtime not found")
    ensure_record_exists(db, "Theater", "ThID", showtime.ThID, "Theater not found")
    ensure_record_exists(db, "Movie", "MID", showtime.MID, "Movie not found")

    db.execute(
        text(
            """
            UPDATE `Showtime`
            SET ShowDate = :ShowDate,
                StartTime = :StartTime,
                EndTime = :EndTime,
                ThID = :ThID,
                MID = :MID
            WHERE ShowtimeID = :showtime_id
            """
        ),
        {"showtime_id": showtime_id, **showtime.model_dump()},
    )
    db.commit()

    updated_showtime = fetch_one(
        db,
        """
        SELECT ShowtimeID, ShowDate, StartTime, EndTime, ThID, MID
        FROM `Showtime`
        WHERE ShowtimeID = :showtime_id
        """,
        {"showtime_id": showtime_id},
    )
    return dict(updated_showtime)

@app.delete("/api/admin/showtimes/{showtime_id}", tags=["Admin - Showtime"], status_code=status.HTTP_204_NO_CONTENT)
def delete_showtime(showtime_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Showtime
    """
    ensure_record_exists(db, "Showtime", "ShowtimeID", showtime_id, "Showtime not found")
    db.execute(
        text("DELETE FROM `Showtime` WHERE ShowtimeID = :showtime_id"),
        {"showtime_id": showtime_id},
    )
    db.commit()
    return None

# Admin Endpoints - Branch

@app.post("/api/admin/branches", response_model=schemas.BranchResponse, tags=["Admin - Branch"], status_code=status.HTTP_201_CREATED)
def create_branch(branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Branch
    """
    result = db.execute(
        text(
            """
            INSERT INTO `Branch` (BName, BLocation, BPhoneNumber)
            VALUES (:BName, :BLocation, :BPhoneNumber)
            """
        ),
        branch.model_dump(),
    )
    db.commit()

    created_branch = fetch_one(
        db,
        "SELECT BID, BName, BLocation, BPhoneNumber FROM `Branch` WHERE BID = :branch_id",
        {"branch_id": result.lastrowid},
    )
    return dict(created_branch)

@app.put("/api/admin/branches/{branch_id}", response_model=schemas.BranchResponse, tags=["Admin - Branch"])
def update_branch(branch_id: int, branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Branch
    """
    ensure_record_exists(db, "Branch", "BID", branch_id, "Branch not found")
    db.execute(
        text(
            """
            UPDATE `Branch`
            SET BName = :BName,
                BLocation = :BLocation,
                BPhoneNumber = :BPhoneNumber
            WHERE BID = :branch_id
            """
        ),
        {"branch_id": branch_id, **branch.model_dump()},
    )
    db.commit()

    updated_branch = fetch_one(
        db,
        "SELECT BID, BName, BLocation, BPhoneNumber FROM `Branch` WHERE BID = :branch_id",
        {"branch_id": branch_id},
    )
    return dict(updated_branch)

@app.delete("/api/admin/branches/{branch_id}", tags=["Admin - Branch"], status_code=status.HTTP_204_NO_CONTENT)
def delete_branch(branch_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Branch
    """
    ensure_record_exists(db, "Branch", "BID", branch_id, "Branch not found")
    db.execute(text("DELETE FROM `Branch` WHERE BID = :branch_id"), {"branch_id": branch_id})
    db.commit()
    return None

# Admin Endpoints - Theater

@app.post("/api/admin/theaters", response_model=schemas.TheaterResponse, tags=["Admin - Theater"], status_code=status.HTTP_201_CREATED)
def create_theater(theater: schemas.TheaterCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Theater
    """
    ensure_record_exists(db, "Branch", "BID", theater.BID, "Branch not found")
    result = db.execute(
        text(
            """
            INSERT INTO `Theater` (ThNumber, ThType, Capacity, BID)
            VALUES (:ThNumber, :ThType, :Capacity, :BID)
            """
        ),
        theater.model_dump(),
    )
    db.commit()

    created_theater = fetch_one(
        db,
        "SELECT ThID, ThNumber, ThType, Capacity, BID FROM `Theater` WHERE ThID = :theater_id",
        {"theater_id": result.lastrowid},
    )
    return dict(created_theater)

@app.put("/api/admin/theaters/{theater_id}", response_model=schemas.TheaterResponse, tags=["Admin - Theater"])
def update_theater(theater_id: int, theater: schemas.TheaterCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Theater
    """
    ensure_record_exists(db, "Theater", "ThID", theater_id, "Theater not found")
    ensure_record_exists(db, "Branch", "BID", theater.BID, "Branch not found")
    db.execute(
        text(
            """
            UPDATE `Theater`
            SET ThNumber = :ThNumber,
                ThType = :ThType,
                Capacity = :Capacity,
                BID = :BID
            WHERE ThID = :theater_id
            """
        ),
        {"theater_id": theater_id, **theater.model_dump()},
    )
    db.commit()

    updated_theater = fetch_one(
        db,
        "SELECT ThID, ThNumber, ThType, Capacity, BID FROM `Theater` WHERE ThID = :theater_id",
        {"theater_id": theater_id},
    )
    return dict(updated_theater)

@app.delete("/api/admin/theaters/{theater_id}", tags=["Admin - Theater"], status_code=status.HTTP_204_NO_CONTENT)
def delete_theater(theater_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Theater
    """
    ensure_record_exists(db, "Theater", "ThID", theater_id, "Theater not found")
    db.execute(text("DELETE FROM `Theater` WHERE ThID = :theater_id"), {"theater_id": theater_id})
    db.commit()
    return None

# Admin Endpoints - Seat

@app.post("/api/admin/seats", response_model=schemas.SeatResponse, tags=["Admin - Seat"], status_code=status.HTTP_201_CREATED)
def create_seat(seat: schemas.SeatCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Seat
    """
    ensure_record_exists(db, "Theater", "ThID", seat.ThID, "Theater not found")
    result = db.execute(
        text(
            """
            INSERT INTO `Seat` (SeatStatus, SeatRow, SeatNumber, SeatType, ThID)
            VALUES (:SeatStatus, :SeatRow, :SeatNumber, :SeatType, :ThID)
            """
        ),
        seat.model_dump(),
    )
    db.commit()

    created_seat = fetch_one(
        db,
        """
        SELECT SeatID, SeatStatus, SeatRow, SeatNumber, SeatType, ThID
        FROM `Seat`
        WHERE SeatID = :seat_id
        """,
        {"seat_id": result.lastrowid},
    )
    return dict(created_seat)

@app.put("/api/admin/seats/{seat_id}", response_model=schemas.SeatResponse, tags=["Admin - Seat"])
def update_seat(seat_id: int, seat: schemas.SeatCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Seat
    """
    ensure_record_exists(db, "Seat", "SeatID", seat_id, "Seat not found")
    ensure_record_exists(db, "Theater", "ThID", seat.ThID, "Theater not found")
    db.execute(
        text(
            """
            UPDATE `Seat`
            SET SeatStatus = :SeatStatus,
                SeatRow = :SeatRow,
                SeatNumber = :SeatNumber,
                SeatType = :SeatType,
                ThID = :ThID
            WHERE SeatID = :seat_id
            """
        ),
        {"seat_id": seat_id, **seat.model_dump()},
    )
    db.commit()

    updated_seat = fetch_one(
        db,
        """
        SELECT SeatID, SeatStatus, SeatRow, SeatNumber, SeatType, ThID
        FROM `Seat`
        WHERE SeatID = :seat_id
        """,
        {"seat_id": seat_id},
    )
    return dict(updated_seat)

@app.delete("/api/admin/seats/{seat_id}", tags=["Admin - Seat"], status_code=status.HTTP_204_NO_CONTENT)
def delete_seat(seat_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Seat
    """
    ensure_record_exists(db, "Seat", "SeatID", seat_id, "Seat not found")
    db.execute(text("DELETE FROM `Seat` WHERE SeatID = :seat_id"), {"seat_id": seat_id})
    db.commit()
    return None

# Admin Endpoints - Promotion

@app.post("/api/admin/promotions", response_model=schemas.PromotionResponse, tags=["Admin - Promotion"], status_code=status.HTTP_201_CREATED)
def create_promotion(promotion: schemas.PromotionCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Promotion
    """
    ensure_record_exists(db, "Admin", "AID", promotion.AID, "Admin not found")
    result = db.execute(
        text(
            """
            INSERT INTO `Promotion` (
                PromotionName, DiscountType, DiscountValue, StartDate, EndDate, AID
            )
            VALUES (
                :PromotionName, :DiscountType, :DiscountValue, :StartDate, :EndDate, :AID
            )
            """
        ),
        promotion.model_dump(),
    )
    db.commit()

    created_promotion = fetch_one(
        db,
        """
        SELECT PromotionID, PromotionName, DiscountType, DiscountValue, StartDate, EndDate, AID
        FROM `Promotion`
        WHERE PromotionID = :promotion_id
        """,
        {"promotion_id": result.lastrowid},
    )
    return dict(created_promotion)

@app.put("/api/admin/promotions/{promotion_id}", response_model=schemas.PromotionResponse, tags=["Admin - Promotion"])
def update_promotion(promotion_id: int, promotion: schemas.PromotionUpdate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Promotion
    """
    existing_promotion = fetch_one(
        db,
        """
        SELECT PromotionID, PromotionName, DiscountType, DiscountValue, StartDate, EndDate, AID
        FROM `Promotion`
        WHERE PromotionID = :promotion_id
        """,
        {"promotion_id": promotion_id},
    )
    if not existing_promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")

    update_data = promotion.model_dump(exclude_unset=True)
    if not update_data:
        return dict(existing_promotion)

    set_clause = ", ".join(f"{column} = :{column}" for column in update_data.keys())
    db.execute(
        text(f"UPDATE `Promotion` SET {set_clause} WHERE PromotionID = :promotion_id"),
        {"promotion_id": promotion_id, **update_data},
    )
    db.commit()

    updated_promotion = fetch_one(
        db,
        """
        SELECT PromotionID, PromotionName, DiscountType, DiscountValue, StartDate, EndDate, AID
        FROM `Promotion`
        WHERE PromotionID = :promotion_id
        """,
        {"promotion_id": promotion_id},
    )
    return dict(updated_promotion)

@app.delete("/api/admin/promotions/{promotion_id}", tags=["Admin - Promotion"], status_code=status.HTTP_204_NO_CONTENT)
def delete_promotion(promotion_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Delete Promotion
    """
    ensure_record_exists(db, "Promotion", "PromotionID", promotion_id, "Promotion not found")
    db.execute(
        text("DELETE FROM `Promotion` WHERE PromotionID = :promotion_id"),
        {"promotion_id": promotion_id},
    )
    db.commit()
    return None

# Admin Endpoints - Payment

@app.get("/api/admin/payments/{payment_id}", response_model=List[schemas.PaymentResponse], tags=["Admin - Payment"])
def get_all_payments(payment_id: int, db: Session = Depends(get_db)):
    """
    Admin Function: Get All Payments
    """
    payment = fetch_one(
        db,
        """
        SELECT PaymentID, Amount, PaymentStatus, PaymentDate, PaymentMethod, BookingID
        FROM `Payment`
        WHERE PaymentID = :payment_id
        """,
        {"payment_id": payment_id},
    )
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    return [dict(payment)]

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

@app.get("/api/users/{uid}/movies", response_model=List[schemas.MovieResponse], tags=["User - Cinema"])
def get_user_related_movies(uid: int, db: Session = Depends(get_db)):
    """
    User Function: Get movies linked to a user via booking or review history
    """
    ensure_record_exists(db, "User", "UID", uid, "User not found")

    movies = db.execute(
        text(
            """
            SELECT DISTINCT
                m.MID,
                m.MName,
                m.Genre,
                m.Duration,
                m.AgeRating,
                m.Description,
                m.ReleaseDate,
                m.Actor,
                m.Director,
                m.ScoreRating,
                m.AID
            FROM `Movie` m
            LEFT JOIN `Showtime` s ON s.MID = m.MID
            LEFT JOIN `Booking` b ON b.ShowtimeID = s.ShowtimeID
            LEFT JOIN `Review` r ON r.MID = m.MID
            WHERE b.UID = :uid OR r.UID = :uid
            ORDER BY m.ReleaseDate DESC, m.MID DESC
            """
        ),
        {"uid": uid},
    ).mappings().all()

    return [dict(movie) for movie in movies]

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
