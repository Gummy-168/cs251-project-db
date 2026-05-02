from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from database import engine, SessionLocal
from typing import List
<<<<<<< HEAD
from datetime import date, datetime, timedelta
from decimal import Decimal
=======
from datetime import date, datetime, timedelta, time
>>>>>>> 56b8797 (update showtime backend)
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
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
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


# ==========================================
# Seat Layout Generation (From HEAD)
# ==========================================
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

# ==========================================
# Database Utilities & Seeding (From Incoming)
# ==========================================
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


<<<<<<< HEAD
def resolve_movie_id(db: Session, payload: schemas.AdminShowtimeCreate) -> tuple[int, int]:
    if payload.MID is not None:
        movie = fetch_one(
            db,
            """
            SELECT MID, Duration
            FROM `Movie`
            WHERE MID = :movie_id
            """,
            {"movie_id": payload.MID},
        )

        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")

        return int(movie["MID"]), int(movie["Duration"])

    keyword = (payload.MovieKeyword or "").strip()

    movie = None
    if keyword.isdigit():
        movie = fetch_one(
            db,
            """
            SELECT MID, Duration
            FROM `Movie`
            WHERE MID = :movie_id
            """,
            {"movie_id": int(keyword)},
        )

    if not movie:
        movie = fetch_one(
            db,
            """
            SELECT MID, Duration
            FROM `Movie`
            WHERE LOWER(MName) = LOWER(:keyword)
            ORDER BY MID DESC
            LIMIT 1
            """,
            {"keyword": keyword},
        )

    if not movie:
        movie = fetch_one(
            db,
            """
            SELECT MID, Duration
            FROM `Movie`
            WHERE LOWER(MName) LIKE LOWER(:keyword)
            ORDER BY MID DESC
            LIMIT 1
            """,
            {"keyword": f"%{keyword}%"},
        )

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    return int(movie["MID"]), int(movie["Duration"])


def parse_theater_number(theater_value: str) -> int:
    digits_only = "".join(char for char in theater_value if char.isdigit())

    if not digits_only:
        raise HTTPException(status_code=400, detail="Theater must include a theater number")

    return int(digits_only)


def resolve_theater_id(db: Session, payload: schemas.AdminShowtimeCreate) -> int:
    if payload.ThID is not None:
        ensure_record_exists(db, "Theater", "ThID", payload.ThID, "Theater not found")
        return payload.ThID

    branch_name = (payload.Branch or "").strip()
    theater_number = parse_theater_number(payload.Theater or "")

    theater = fetch_one(
        db,
        """
        SELECT t.ThID
        FROM `Theater` t
        JOIN `Branch` b ON t.BID = b.BID
        WHERE LOWER(b.BName) = LOWER(:branch_name)
          AND t.ThNumber = :theater_number
        LIMIT 1
        """,
        {
            "branch_name": branch_name,
            "theater_number": theater_number,
        },
    )

    if not theater:
        raise HTTPException(status_code=404, detail="Theater not found for the selected branch")

    return int(theater["ThID"])


def compute_end_time(start_time, duration_minutes: int):
    start_datetime = datetime.combine(date.today(), start_time)
    return (start_datetime + timedelta(minutes=duration_minutes)).time()


def fetch_promotion_by_id(db: Session, promotion_id: int):
    return fetch_one(
        db,
        """
        SELECT PromotionID, PromotionName, DiscountType, DiscountValue, StartDate, EndDate, AID
        FROM `Promotion`
        WHERE PromotionID = :promotion_id
        """,
        {"promotion_id": promotion_id},
    )


def calculate_promotion_discount(total_price: Decimal, promotion: dict | None) -> tuple[Decimal, Decimal]:
    if not promotion:
        return Decimal("0.00"), total_price

    discount_value = Decimal(promotion["DiscountValue"])
    if promotion["DiscountType"] == "Percentage":
        discount_amount = (total_price * discount_value) / Decimal("100")
    else:
        discount_amount = discount_value

    if discount_amount > total_price:
        discount_amount = total_price

    final_price = total_price - discount_amount
    return discount_amount.quantize(Decimal("0.01")), final_price.quantize(Decimal("0.01"))
=======
def resolve_end_time(
    db: Session,
    mid: int,
    show_date: date,
    start_time,
    end_time,
):
    if end_time is not None:
        return end_time

    movie_row = fetch_one(
        db,
        "SELECT Duration FROM `Movie` WHERE MID = :mid",
        {"mid": mid},
    )
    if not movie_row:
        raise HTTPException(status_code=404, detail="Movie not found")

    duration_minutes = int(movie_row["Duration"])
    start_dt = datetime.combine(show_date, start_time)
    computed_end = (start_dt + timedelta(minutes=duration_minutes)).time()
    return computed_end


def normalize_db_time(value):
    if isinstance(value, timedelta):
        total_seconds = int(value.total_seconds()) % (24 * 3600)
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        return time(hour=hours, minute=minutes, second=seconds)
    return value


def normalize_showtime_payload(row: dict) -> dict:
    row["StartTime"] = normalize_db_time(row.get("StartTime"))
    row["EndTime"] = normalize_db_time(row.get("EndTime"))
    return row
>>>>>>> 56b8797 (update showtime backend)


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
            movie_id = db.execute(
                text("SELECT MID FROM `Movie` WHERE MName = :name AND AID = :aid LIMIT 1"),
                {"name": "Welcome Movie", "aid": admin_id},
            ).mappings().first()["MID"]
        else:
            movie_id = existing_movie["MID"]

        branch = fetch_one(
            db,
            """
            SELECT BID
            FROM `Branch`
            WHERE BName = :name
            LIMIT 1
            """,
            {"name": "Rangsit"},
        )
        if branch:
            branch_id = branch["BID"]
        else:
            branch_result = db.execute(
                text(
                    """
                    INSERT INTO `Branch` (BName, BLocation, BPhoneNumber)
                    VALUES (:name, :location, :phone)
                    """
                ),
                {
                    "name": "Rangsit",
                    "location": "Rangsit, Pathum Thani",
                    "phone": "0200000001",
                },
            )
            db.commit()
            branch_id = branch_result.lastrowid

        theater = fetch_one(
            db,
            """
            SELECT ThID
            FROM `Theater`
            WHERE BID = :bid AND ThNumber = :number
            LIMIT 1
            """,
            {"bid": branch_id, "number": 1},
        )
        if theater:
            theater_id = theater["ThID"]
        else:
            theater_result = db.execute(
                text(
                    """
                    INSERT INTO `Theater` (ThNumber, ThType, Capacity, BID)
                    VALUES (:number, :type, :capacity, :bid)
                    """
                ),
                {
                    "number": 1,
                    "type": "IMAX",
                    "capacity": 120,
                    "bid": branch_id,
                },
            )
            db.commit()
            theater_id = theater_result.lastrowid

        default_showtimes = [
            {"show_date": "2026-05-02", "start_time": "15:23:00", "end_time": "17:23:00"},
            {"show_date": "2026-05-02", "start_time": "22:30:00", "end_time": "23:59:00"},
        ]

        for item in default_showtimes:
            existing_showtime = fetch_one(
                db,
                """
                SELECT ShowtimeID
                FROM `Showtime`
                WHERE ShowDate = :show_date
                  AND StartTime = :start_time
                  AND ThID = :thid
                  AND MID = :mid
                LIMIT 1
                """,
                {
                    "show_date": item["show_date"],
                    "start_time": item["start_time"],
                    "thid": theater_id,
                    "mid": movie_id,
                },
            )

            if existing_showtime:
                continue

            db.execute(
                text(
                    """
                    INSERT INTO `Showtime` (ShowDate, StartTime, EndTime, ThID, MID)
                    VALUES (:show_date, :start_time, :end_time, :thid, :mid)
                    """
                ),
                {
                    "show_date": item["show_date"],
                    "start_time": item["start_time"],
                    "end_time": item["end_time"],
                    "thid": theater_id,
                    "mid": movie_id,
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

@app.get("/api/admin/showtimes", tags=["Admin - Showtime"])
def get_admin_showtimes(
    show_date: str | None = None,
    date: str | None = None,
    movie_id: int | None = None,
    name: str | None = None,
    movie_name: str | None = None,
    db: Session = Depends(get_db),
):
    """
    Admin Function: Get Showtime list with linked Movie, Theater, and Branch data
    """
    query = """
        SELECT
            s.ShowtimeID,
            s.ShowDate,
            TIME_FORMAT(s.StartTime, '%H:%i') AS StartTime,
            TIME_FORMAT(s.EndTime, '%H:%i') AS EndTime,
            m.MID,
            m.MName,
            t.ThID,
            t.ThNumber,
            t.ThType,
            b.BID,
            b.BName,
            b.BLocation
        FROM `Showtime` s
        JOIN `Movie` m ON m.MID = s.MID
        JOIN `Theater` t ON t.ThID = s.ThID
        JOIN `Branch` b ON b.BID = t.BID
        WHERE 1 = 1
    """
    params = {}

    effective_show_date = show_date or date
    effective_movie_name = movie_name or name

    if effective_show_date:
        query += " AND s.ShowDate = :show_date"
        params["show_date"] = effective_show_date

    if movie_id:
        query += " AND m.MID = :movie_id"
        params["movie_id"] = movie_id

    if effective_movie_name:
        query += " AND m.MName LIKE :movie_name"
        params["movie_name"] = f"%{effective_movie_name}%"

    query += " ORDER BY s.ShowDate ASC, b.BID ASC, t.ThNumber ASC, s.StartTime ASC"

    rows = db.execute(text(query), params).mappings().all()
    return [dict(row) for row in rows]

@app.post("/api/admin/showtimes", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"], status_code=status.HTTP_201_CREATED)
def create_showtime(showtime: schemas.AdminShowtimeCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Add Showtime
    """
<<<<<<< HEAD
    movie_id, duration_minutes = resolve_movie_id(db, showtime)
    theater_id = resolve_theater_id(db, showtime)
    end_time = showtime.EndTime or compute_end_time(showtime.StartTime, duration_minutes)

    payload = {
        "ShowDate": showtime.ShowDate,
        "StartTime": showtime.StartTime,
        "EndTime": end_time,
        "ThID": theater_id,
        "MID": movie_id,
    }

    result = db.execute(
        text(
            """
            INSERT INTO `Showtime` (ShowDate, StartTime, EndTime, ThID, MID)
            VALUES (:ShowDate, :StartTime, :EndTime, :ThID, :MID)
            """
        ),
        payload,
=======
    computed_end_time = resolve_end_time(
        db=db,
        mid=showtime.MID,
        show_date=showtime.ShowDate,
        start_time=showtime.StartTime,
        end_time=showtime.EndTime,
>>>>>>> 56b8797 (update showtime backend)
    )

    if computed_end_time <= showtime.StartTime:
        raise HTTPException(
            status_code=422,
            detail="EndTime must be later than StartTime on the same date",
        )

    try:
        ensure_record_exists(db, "Theater", "ThID", showtime.ThID, "Theater not found")
        ensure_record_exists(db, "Movie", "MID", showtime.MID, "Movie not found")

        payload = showtime.model_dump()
        payload["EndTime"] = computed_end_time

        result = db.execute(
            text(
                """
                INSERT INTO `Showtime` (ShowDate, StartTime, EndTime, ThID, MID)
                VALUES (:ShowDate, :StartTime, :EndTime, :ThID, :MID)
                """
            ),
            payload,
        )
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database integrity error: {str(exc.orig)}")
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(exc)}")

    created_showtime = fetch_one(
        db,
        """
        SELECT ShowtimeID, ShowDate, StartTime, EndTime, ThID, MID
        FROM `Showtime`
        WHERE ShowtimeID = :showtime_id
        """,
        {"showtime_id": result.lastrowid},
    )
    return normalize_showtime_payload(dict(created_showtime))

@app.put("/api/admin/showtimes/{showtime_id}", response_model=schemas.ShowtimeResponse, tags=["Admin - Showtime"])
def update_showtime(showtime_id: int, showtime: schemas.ShowtimeCreate, db: Session = Depends(get_db)):
    """
    Admin Function: Edit Showtime
    """
    ensure_record_exists(db, "Showtime", "ShowtimeID", showtime_id, "Showtime not found")
    ensure_record_exists(db, "Theater", "ThID", showtime.ThID, "Theater not found")
    ensure_record_exists(db, "Movie", "MID", showtime.MID, "Movie not found")

    computed_end_time = resolve_end_time(
        db=db,
        mid=showtime.MID,
        show_date=showtime.ShowDate,
        start_time=showtime.StartTime,
        end_time=showtime.EndTime,
    )
    if computed_end_time <= showtime.StartTime:
        raise HTTPException(
            status_code=422,
            detail="EndTime must be later than StartTime on the same date",
        )

    payload = showtime.model_dump()
    payload["EndTime"] = computed_end_time

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
        {"showtime_id": showtime_id, **payload},
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
    return normalize_showtime_payload(dict(updated_showtime))

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

@app.get("/api/admin/promotions", response_model=List[schemas.PromotionResponse], tags=["Admin - Promotion"])
def get_admin_promotions(db: Session = Depends(get_db)):
    """
    Admin Function: Get all promotions
    """
    promotions = db.execute(
        text(
            """
            SELECT PromotionID, PromotionName, DiscountType, DiscountValue, StartDate, EndDate, AID
            FROM `Promotion`
            ORDER BY StartDate DESC, PromotionID DESC
            """
        )
    ).mappings().all()

    return promotions

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
    existing_promotion = fetch_promotion_by_id(db, promotion_id)
    if not existing_promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")

    update_data = promotion.model_dump(exclude_unset=True)
    if not update_data:
        return dict(existing_promotion)

    next_start_date = update_data.get("StartDate", existing_promotion["StartDate"])
    next_end_date = update_data.get("EndDate", existing_promotion["EndDate"])
    if next_end_date < next_start_date:
        raise HTTPException(status_code=400, detail="EndDate must be greater than or equal to StartDate")

    set_clause = ", ".join(f"{column} = :{column}" for column in update_data.keys())
    db.execute(
        text(f"UPDATE `Promotion` SET {set_clause} WHERE PromotionID = :promotion_id"),
        {"promotion_id": promotion_id, **update_data},
    )
    db.commit()

    updated_promotion = fetch_promotion_by_id(db, promotion_id)
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
    base_total_price = Decimal(str(sum(seat["Price"] for seat in normalized_seats)))
    selected_promotion = None

    if booking.PromotionID is not None:
        selected_promotion = fetch_promotion_by_id(db, booking.PromotionID)
        if not selected_promotion:
            raise HTTPException(status_code=404, detail="Promotion not found")

        today = date.today()
        if selected_promotion["StartDate"] > today or selected_promotion["EndDate"] < today:
            raise HTTPException(status_code=409, detail="Promotion is not active")

    _, total_price = calculate_promotion_discount(base_total_price, selected_promotion)

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
                VALUES ('Confirmed', :booking_date, :total_price, :uid, :showtime_id, :promotion_id)
                """
            ),
            {
                "booking_date": date.today(),
                "total_price": total_price,
                "uid": booking.UID,
                "showtime_id": booking.ShowtimeID,
                "promotion_id": booking.PromotionID,
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

@app.get("/api/promotions", response_model=List[schemas.PromotionResponse], tags=["User - Promotion"])
def get_active_promotions(db: Session = Depends(get_db)):
    """
    User Function: Get active promotions that have not expired
    """
    promotions = db.execute(
        text(
            """
            SELECT PromotionID, PromotionName, DiscountType, DiscountValue, StartDate, EndDate, AID
            FROM `Promotion`
            WHERE StartDate <= CURRENT_DATE()
              AND EndDate >= CURRENT_DATE()
            ORDER BY EndDate ASC, PromotionID DESC
            """
        )
    ).mappings().all()

    return promotions


@app.post("/api/promotions/validate", response_model=schemas.PromotionValidateResponse, tags=["User - Promotion"])
def validate_promotion(payload: schemas.PromotionValidateRequest, db: Session = Depends(get_db)):
    """
    User Function: Validate promo code and calculate discount
    """
    promo_code = payload.PromoCode.strip()

    if not promo_code:
        raise HTTPException(status_code=400, detail="PromoCode is required")

    promotion = fetch_one(
        db,
        """
        SELECT PromotionID, PromotionName, DiscountType, DiscountValue, StartDate, EndDate, AID
        FROM `Promotion`
        WHERE LOWER(PromotionName) = LOWER(:promo_code)
        LIMIT 1
        """,
        {"promo_code": promo_code},
    )

    if not promotion:
        return {
            "IsValid": False,
            "DiscountValue": Decimal("0.00"),
            "DiscountAmount": Decimal("0.00"),
            "FinalPrice": payload.TotalPrice,
            "Message": "Promo code not found",
        }

    today = date.today()
    if promotion["StartDate"] > today:
        return {
            "IsValid": False,
            "PromotionID": promotion["PromotionID"],
            "PromotionName": promotion["PromotionName"],
            "DiscountType": promotion["DiscountType"],
            "DiscountValue": promotion["DiscountValue"],
            "DiscountAmount": Decimal("0.00"),
            "FinalPrice": payload.TotalPrice,
            "Message": "Promotion is not active yet",
        }

    if promotion["EndDate"] < today:
        return {
            "IsValid": False,
            "PromotionID": promotion["PromotionID"],
            "PromotionName": promotion["PromotionName"],
            "DiscountType": promotion["DiscountType"],
            "DiscountValue": promotion["DiscountValue"],
            "DiscountAmount": Decimal("0.00"),
            "FinalPrice": payload.TotalPrice,
            "Message": "Promotion has expired",
        }

    total_price = Decimal(payload.TotalPrice)
    discount_value = Decimal(promotion["DiscountValue"])

    if promotion["DiscountType"] == "Percentage":
        discount_amount = (total_price * discount_value) / Decimal("100")
    else:
        discount_amount = discount_value

    if discount_amount > total_price:
        discount_amount = total_price

    final_price = total_price - discount_amount

    return {
        "IsValid": True,
        "PromotionID": promotion["PromotionID"],
        "PromotionName": promotion["PromotionName"],
        "DiscountType": promotion["DiscountType"],
        "DiscountValue": discount_value,
        "DiscountAmount": discount_amount.quantize(Decimal("0.01")),
        "FinalPrice": final_price.quantize(Decimal("0.01")),
        "Message": "Promotion is valid",
    }

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
