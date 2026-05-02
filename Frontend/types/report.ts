export interface TrendingMovieReport {
  MID: number;
  MName: string;
  Description: string | null;
}

export interface PerformanceLogRecord {
  MID: number;
  MName: string;
  ShowDate: string;
  TCOUNT: number;
  INCOME: number | string;
}

export interface PerformanceLogPage {
  items: PerformanceLogRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface PerformanceLogParams {
  search?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}
