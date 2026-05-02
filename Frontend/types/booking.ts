export interface BackendShowtimeSlot {
  ShowtimeID: number;
  StartTime: string;
  EndTime: string;
  Language: string;
}

export interface BackendTheaterShowtimeGroup {
  ThID: number;
  ThName: string;
  Format: string | null;
  Showtimes: BackendShowtimeSlot[];
}

export interface BackendBranchShowtimeGroup {
  BID: number;
  BName: string;
  BLocation: string;
  Theaters: BackendTheaterShowtimeGroup[];
}

export interface BackendMovieShowtimeDateGroup {
  ShowDate: string;
  Branches: BackendBranchShowtimeGroup[];
}

export interface ShowtimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  language: string;
}

export interface TheaterShowtimeGroup {
  id: number;
  name: string;
  format: string | null;
  showtimes: ShowtimeSlot[];
}

export interface BranchShowtimeGroup {
  id: number;
  name: string;
  location: string;
  theaters: TheaterShowtimeGroup[];
}

export interface MovieShowtimeDateGroup {
  showDate: string;
  branches: BranchShowtimeGroup[];
}

export interface BookingSeatInput {
  SeatRow: string;
  SeatNumber: number;
}

export interface BookingCreatePayload {
  ShowtimeID: number;
  UID: number;
  Seats: BookingSeatInput[];
  PromotionID?: number | null;
}

export interface BookingRecord {
  BookingID: number;
  BookingDate: string;
  BookingStatus: string;
  TotalPrice: number | string;
  UID: number;
  ShowtimeID: number;
  PromotionID?: number | null;
}

export interface BackendUserBookingSeat {
  TicketID: number;
  SeatID: number;
  SeatRow: string;
  SeatNumber: number;
  Price: number | string;
}

export interface BackendUserBookingHistory {
  BookingID: number;
  BookingDate: string;
  BookingStatus: string;
  TotalPrice: number | string;
  UID: number;
  ShowtimeID: number;
  PromotionID?: number | null;
  MID: number;
  MName: string;
  ShowDate: string;
  StartTime: string;
  EndTime: string;
  BID: number;
  BName: string;
  BLocation: string;
  ThID: number;
  ThNumber: number;
  ThType: string;
  Seats: BackendUserBookingSeat[];
  Review?: BackendBookingReview | null;
}

export interface UserBookingSeat {
  ticketId: number;
  seatId: number;
  seatRow: string;
  seatNumber: number;
  price: number;
}

export interface BackendBookingReview {
  ReviewID: number;
  ReviewDate: string;
  ReviewScore: number;
  Comment?: string | null;
}

export interface BookingReview {
  reviewId: number;
  reviewDate: string;
  reviewScore: number;
  comment?: string | null;
}

export interface UserBookingHistory {
  bookingId: number;
  bookingDate: string;
  bookingStatus: string;
  totalPrice: number;
  uid: number;
  showtimeId: number;
  promotionId?: number | null;
  movieId: number;
  movieTitle: string;
  showDate: string;
  startTime: string;
  endTime: string;
  branchId: number;
  branchName: string;
  branchLocation: string;
  theaterId: number;
  theaterNumber: number;
  theaterType: string;
  seats: UserBookingSeat[];
  review?: BookingReview | null;
}

export interface ReviewCreatePayload {
  UID: number;
  MID: number;
  ReviewScore: number;
  Comment?: string | null;
}

export interface ReviewRecord {
  ReviewID: number;
  ReviewDate: string;
  ReviewScore: number;
  Comment?: string | null;
  UID: number;
  MID: number;
}

export interface AdminShowtimeCreatePayload {
<<<<<<< HEAD
  MID?: number;
  MovieKeyword?: string;
  ThID?: number;
  Branch: string;
  Theater: string;
  ShowDate: string;
  StartTime: string;
  EndTime?: string;
=======
  MID: number;
  ThID: number;
  ShowDate: string;
  StartTime: string;
  EndTime: string;
>>>>>>> 3eb04d1 (Fix Show time)
}

export interface BackendAdminShowtimeRecord {
  ShowtimeID: number;
  ThID: number;
  MID: number;
  ShowDate: string;
  StartTime: string;
  EndTime: string;
}

export interface BackendAdminShowtimeListRecord {
  ShowtimeID: number;
  ShowDate: string;
  StartTime: string;
  EndTime: string;
  MID: number;
  MName: string;
  ThID: number;
  ThNumber: number;
  ThType: string;
  BID: number;
  BName: string;
  BLocation: string;
}
