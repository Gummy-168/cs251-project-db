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