-- Table: User
CREATE TABLE IF NOT EXISTS User (
    UID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    UName VARCHAR(100) NOT NULL,
    UPassword VARCHAR(255) NOT NULL,
    UEmail VARCHAR(100) NOT NULL UNIQUE,
    UPhoneNumber VARCHAR(15) NOT NULL UNIQUE
);

-- Table: Admin
CREATE TABLE IF NOT EXISTS Admin (
    AID INT AUTO_INCREMENT PRIMARY KEY,
    AName VARCHAR(100) NOT NULL,
    AEmail VARCHAR(100) NOT NULL UNIQUE,
    APassword VARCHAR(255) NOT NULL
);

-- Table: Branch
CREATE TABLE IF NOT EXISTS Branch (
    BID INT AUTO_INCREMENT PRIMARY KEY,
    BName VARCHAR(100) NOT NULL,
    BLocation VARCHAR(255) NOT NULL,
    BPhoneNumber VARCHAR(15) NOT NULL UNIQUE
);

-- Table: Movie
CREATE TABLE IF NOT EXISTS Movie (
    MID INT AUTO_INCREMENT PRIMARY KEY,
    MName VARCHAR(200) NOT NULL,
    Genre VARCHAR(50) NOT NULL,
    Duration INT NOT NULL CHECK (Duration > 0),
    AgeRating VARCHAR(10) NOT NULL CHECK (AgeRating IN ('G', 'PG', 'PG-13', 'R', 'NC-17')),
    Description TEXT,
    ReleaseDate DATE NOT NULL,
    Actor VARCHAR(255),
    Director VARCHAR(100),
    ScoreRating DECIMAL(2,1) DEFAULT 0.0 CHECK (ScoreRating >= 0 AND ScoreRating <= 10),
    AID INT NOT NULL,
    CONSTRAINT fk_movie_admin
        FOREIGN KEY (AID) REFERENCES Admin(AID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Table: Theater
CREATE TABLE IF NOT EXISTS Theater (
    ThID INT AUTO_INCREMENT PRIMARY KEY,
    ThNumber INT NOT NULL,
    ThType VARCHAR(50) NOT NULL CHECK (ThType IN ('2D', '3D', 'IMAX', '4DX')),
    Capacity INT NOT NULL CHECK (Capacity > 0),
    BID INT NOT NULL,
    CONSTRAINT fk_theater_branch
        FOREIGN KEY (BID) REFERENCES Branch(BID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT uq_theater_branch_number UNIQUE (BID, ThNumber)
);

-- Table: Seat
CREATE TABLE IF NOT EXISTS Seat (
    SeatID INT AUTO_INCREMENT PRIMARY KEY,
    SeatStatus VARCHAR(20) NOT NULL CHECK (SeatStatus IN ('Available', 'Booked', 'Unavailable')),
    SeatRow CHAR(1) NOT NULL,
    SeatNumber INT NOT NULL CHECK (SeatNumber > 0),
    SeatType VARCHAR(50) NOT NULL CHECK (SeatType IN ('Regular', 'VIP', 'Honeymoon')),
    ThID INT NOT NULL,
    CONSTRAINT fk_seat_theater
        FOREIGN KEY (ThID) REFERENCES Theater(ThID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT uq_seat_in_theater UNIQUE (ThID, SeatRow, SeatNumber)
);

-- Table: Showtime
CREATE TABLE IF NOT EXISTS Showtime (
    ShowtimeID INT AUTO_INCREMENT PRIMARY KEY,
    ShowDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    ThID INT NOT NULL,
    MID INT NOT NULL,
    CONSTRAINT chk_showtime_time CHECK (EndTime > StartTime),
    CONSTRAINT fk_showtime_theater
        FOREIGN KEY (ThID) REFERENCES Theater(ThID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_showtime_movie
        FOREIGN KEY (MID) REFERENCES Movie(MID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Table: Promotion
CREATE TABLE IF NOT EXISTS Promotion (
    PromotionID INT AUTO_INCREMENT PRIMARY KEY,
    PromotionName VARCHAR(100) NOT NULL,
    DiscountType VARCHAR(20) NOT NULL CHECK (DiscountType IN ('Percentage', 'Fixed Amount')),
    DiscountValue DECIMAL(10,2) NOT NULL CHECK (DiscountValue >= 0),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    AID INT NOT NULL,
    CONSTRAINT chk_promotion_date CHECK (EndDate >= StartDate),
    CONSTRAINT fk_promotion_admin
        FOREIGN KEY (AID) REFERENCES Admin(AID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Table: Booking
CREATE TABLE IF NOT EXISTS Booking (
    BookingID INT AUTO_INCREMENT PRIMARY KEY,
    BookingStatus VARCHAR(20) NOT NULL,
    BookingDate DATE NOT NULL,
    TotalPrice DECIMAL(10,2) NOT NULL CHECK (TotalPrice >= 0),
    UID INT NOT NULL,
    ShowtimeID INT NOT NULL,
    PromotionID INT,
    CONSTRAINT fk_booking_user
        FOREIGN KEY (UID) REFERENCES User(UID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_booking_showtime
        FOREIGN KEY (ShowtimeID) REFERENCES Showtime(ShowtimeID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_booking_promotion
        FOREIGN KEY (PromotionID) REFERENCES Promotion(PromotionID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);


-- Table : Ticket
CREATE TABLE IF NOT EXISTS Ticket (
    TicketID INT AUTO_INCREMENT PRIMARY KEY,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    BookingID INT NOT NULL,
    SeatID INT NOT NULL,
    CONSTRAINT fk_ticket_booking
        FOREIGN KEY (BookingID) REFERENCES Booking(BookingID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_ticket_seat
        FOREIGN KEY (SeatID) REFERENCES Seat(SeatID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Table: Payment
CREATE TABLE IF NOT EXISTS Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount >= 0),
    PaymentStatus VARCHAR(20) NOT NULL CHECK (PaymentStatus IN ('Pending', 'Completed', 'Failed')),
    PaymentDate DATE NOT NULL,
    PaymentMethod VARCHAR(50) NOT NULL,
    BookingID INT NOT NULL,
    CONSTRAINT fk_payment_booking
        FOREIGN KEY (BookingID) REFERENCES Booking(BookingID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Table: Review
CREATE TABLE IF NOT EXISTS Review (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    ReviewDate DATE NOT NULL,
    ReviewScore INT NOT NULL CHECK (ReviewScore BETWEEN 1 AND 5),
    Comment TEXT,
    UID INT NOT NULL,
    MID INT NOT NULL,
    CONSTRAINT fk_review_user
        FOREIGN KEY (UID) REFERENCES User(UID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_review_movie
        FOREIGN KEY (MID) REFERENCES Movie(MID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
