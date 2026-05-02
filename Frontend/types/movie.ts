export interface BackendMovie {
  MID: number;
  MName: string;
  Genre: string;
  Duration: number;
  AgeRating: string;
  Description: string | null;
  ReleaseDate: string;
  Actor: string | null;
  Director: string | null;
  ScoreRating: number | string | null;
  AID: number;
}

export interface MovieCard {
  id: number;
  title: string;
  genre: string;
  genres: string[];
  duration: number;
  durationLabel: string;
  ageRating: string;
  description: string | null;
  releaseDate: string;
  scoreRating: number | null;
  image: string;
}

export interface MovieDetailPerson {
  id: number;
  name: string;
  role: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  poster: string;
  rating: number | null;
  durationLabel: string;
  ageRate: string;
  genres: string[];
  description: string;
  releaseDate: string;
  director: MovieDetailPerson[];
  cast: MovieDetailPerson[];
}

export interface AdminMovieCreatePayload {
  MName: string;
  Genre: string;
  Duration: number;
  AgeRating: string;
  Description?: string | null;
  ReleaseDate: string;
  Actor?: string | null;
  Director?: string | null;
  ScoreRating?: number | null;
  AID: number;
}

export interface AdminMovieUpdatePayload {
  MName?: string;
  Genre?: string;
  Duration?: number;
  AgeRating?: string;
  Description?: string | null;
  ReleaseDate?: string;
  Actor?: string | null;
  Director?: string | null;
  ScoreRating?: number | null;
}
