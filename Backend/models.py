from sqlalchemy import Column, Integer, String, Text, Date, Time, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# Mocking Admin Table for now, as we need AID for Movie table
class Admin(Base):
    __tablename__ = "admin"
    AID = Column(Integer, primary_key=True, index=True)
    AName = Column(String(100), nullable=False)
    AEmail = Column(String(100), unique=True, nullable=False)
    APassword = Column(String(255), nullable=False)

    movies = relationship("Movie", back_populates="admin")

# Cinema stuff

class Branch(Base):
    __tablename__ = "branch"
    BID = Column(Integer, primary_key=True, index=True)
    BName = Column(String(100), nullable=False)
    BLocation = Column(String(255), nullable=False)
    BPhoneNumber = Column(String(15), unique=True, nullable=False)

    theaters = relationship("Theater", back_populates="branch")

class Theater(Base):
    __tablename__ = "theater"
    ThID = Column(Integer, primary_key=True, index=True)
    ThNumber = Column(Integer, nullable=False)
    ThType = Column(String(50), nullable=False) # 2D, 3D, IMAX, 4DX
    Capacity = Column(Integer, nullable=False)
    BID = Column(Integer, ForeignKey("branch.BID"), nullable=False)

    branch = relationship("Branch", back_populates="theaters")
    showtimes = relationship("Showtime", back_populates="theater")
    seats = relationship("Seat", back_populates="theater")

class Movie(Base):
    __tablename__ = "movie"
    MID = Column(Integer, primary_key=True, index=True)
    MName = Column(String(200), nullable=False)
    Genre = Column(String(50), nullable=False)
    Duration = Column(Integer, nullable=False)
    AgeRating = Column(String(10), nullable=False)
    Description = Column(Text)
    ReleaseDate = Column(Date, nullable=False)
    Actor = Column(String(255))
    Director = Column(String(100))
    ScoreRating = Column(Numeric(2, 1), default=0.0)
    AID = Column(Integer, ForeignKey("admin.AID"), nullable=False)

    admin = relationship("Admin", back_populates="movies")
    showtimes = relationship("Showtime", back_populates="movie")

class Showtime(Base):
    __tablename__ = "showtime"
    ShowtimeID = Column(Integer, primary_key=True, index=True)
    ShowDate = Column(Date, nullable=False)
    StartTime = Column(Time, nullable=False)
    EndTime = Column(Time, nullable=False)
    ThID = Column(Integer, ForeignKey("theater.ThID"), nullable=False)
    MID = Column(Integer, ForeignKey("movie.MID"), nullable=False)

    theater = relationship("Theater", back_populates="showtimes")
    movie = relationship("Movie", back_populates="showtimes")

class Seat(Base):
    __tablename__ = "seat"
    SeatID = Column(Integer, primary_key=True, index=True)
    SeatStatus = Column(String(20), nullable=False) # Available, Booked, Unavailable
    SeatRow = Column(String(1), nullable=False)
    SeatNumber = Column(Integer, nullable=False)
    SeatType = Column(String(50), nullable=False) # Regular, VIP, Honeymoon
    ThID = Column(Integer, ForeignKey("theater.ThID"), nullable=False)

    theater = relationship("Theater", back_populates="seats")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
