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
