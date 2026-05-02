import type {
  BackendMovie,
  MovieCard,
  MovieDetail,
  MovieDetailPerson,
} from "@/types/movie";
import type {
  BackendMovieShowtimeDateGroup,
  MovieShowtimeDateGroup,
} from "@/types/booking";
import type {
  UserAuth,
  UserRegisterPayload,
  UserSigninPayload,
  UserSigninResponse,
  UserUpdatePayload,
} from "@/types/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

const localMoviePosterMap: Record<string, string> = {
  "jujutsu kaisen 0": "/image/jujutsu.jpg",
  "deadpool & wolverine": "/image/deadpool.webp",
  "blue lock: episode nagi": "/image/bluelock.webp",
  "detective conan: fall...": "/image/conan.webp",
  goat: "/image/goat.jpg",
  "lee cronin's the mummy": "/image/themummy.webp",
  "the convenience store": "/image/theconveniencestore.jpg",
  gohan: "/image/gohan.webp",
};

function normalizeMovieKey(value: string) {
  return value.trim().toLowerCase();
}

export function resolveMovieImage(movie: Pick<BackendMovie, "MName">) {
  return (
    localMoviePosterMap[normalizeMovieKey(movie.MName)] || "/image/jujutsu.jpg"
  );
}

function parseGenres(genre: string) {
  return genre
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNullableNumber(value: BackendMovie["ScoreRating"]) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function mapMovieToCard(movie: BackendMovie): MovieCard {
  const genres = parseGenres(movie.Genre);

  return {
    id: movie.MID,
    title: movie.MName,
    genre: movie.Genre,
    genres,
    duration: movie.Duration,
    durationLabel: `${movie.Duration} นาที`,
    ageRating: movie.AgeRating,
    description: movie.Description,
    releaseDate: movie.ReleaseDate,
    scoreRating: toNullableNumber(movie.ScoreRating),
    image: resolveMovieImage(movie),
  };
}

function mapPeople(value: string | null, role: string): MovieDetailPerson[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((name, index) => ({
      id: index + 1,
      name,
      role,
    }));
}

function mapMovieToDetail(movie: BackendMovie): MovieDetail {
  return {
    id: movie.MID,
    title: movie.MName,
    poster: resolveMovieImage(movie),
    rating: toNullableNumber(movie.ScoreRating),
    durationLabel: `${movie.Duration} นาที`,
    ageRate: movie.AgeRating,
    genres: parseGenres(movie.Genre),
    description: movie.Description || "ยังไม่มีเรื่องย่อสำหรับภาพยนตร์เรื่องนี้",
    releaseDate: movie.ReleaseDate,
    director: mapPeople(movie.Director, "ผู้กำกับ"),
    cast: mapPeople(movie.Actor, "นักแสดง"),
  };
}

function mapShowtimeGroups(
  groups: BackendMovieShowtimeDateGroup[]
): MovieShowtimeDateGroup[] {
  return groups.map((group) => ({
    showDate: group.ShowDate,
    branches: group.Branches.map((branch) => ({
      id: branch.BID,
      name: branch.BName,
      location: branch.BLocation,
      theaters: branch.Theaters.map((theater) => ({
        id: theater.ThID,
        name: theater.ThName,
        format: theater.Format,
        showtimes: theater.Showtimes.map((showtime) => ({
          id: showtime.ShowtimeID,
          startTime: showtime.StartTime,
          endTime: showtime.EndTime,
          language: showtime.Language,
        })),
      })),
    })),
  }));
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();
      if (typeof errorBody?.detail === "string") {
        detail = errorBody.detail;
      }
    } catch {
      // Ignore JSON parsing errors and use the default message.
    }

    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export async function getMovies(): Promise<MovieCard[]> {
  const movies = await apiFetch<BackendMovie[]>("/api/movies");
  return movies.map(mapMovieToCard);
}

export async function getMovieById(
  movieId: string | number
): Promise<MovieDetail> {
  const movie = await apiFetch<BackendMovie>(`/api/movies/${movieId}`);
  return mapMovieToDetail(movie);
}

export async function getShowtimesByMovieId(
  movieId: string | number
): Promise<MovieShowtimeDateGroup[]> {
  const groups = await apiFetch<BackendMovieShowtimeDateGroup[]>(
    `/api/movies/${movieId}/showtimes`
  );
  return mapShowtimeGroups(groups);
}

export async function registerUser(
  userData: UserRegisterPayload
): Promise<UserAuth> {
  return apiFetch<UserAuth>("/api/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function signInUser(
  credentials: UserSigninPayload
): Promise<UserSigninResponse> {
  return apiFetch<UserSigninResponse>("/api/users/signin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function updateUserProfile(
  uid: string | number,
  userData: UserUpdatePayload
): Promise<UserAuth> {
  return apiFetch<UserAuth>(`/api/users/${uid}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

export { API_BASE_URL };
