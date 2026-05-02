export interface BackendSeat {
  SeatID: number;
  SeatStatus: string;
  SeatRow: string;
  SeatNumber: number;
  SeatType: string;
  ThID: number;
  Price?: number | string | null;
}

export interface SeatLayoutSeat {
  id: string;
  seatId: number;
  row: string;
  number: number;
  status: "standard" | "premium" | "unavailable";
  seatType: string;
  price: number;
  theaterId: number;
}
