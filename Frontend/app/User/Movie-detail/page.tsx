"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { getMovieById } from "@/services/api";
import type { MovieDetail } from "@/types/movie";

export default function MovieDetailPage() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movieId");

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovieDetail() {
      try {
        if (!movieId) {
          throw new Error("ไม่พบรหัสภาพยนตร์");
        }

        setLoading(true);
        setError(null);

        const data = await getMovieById(movieId);
        setMovie(data);
      } catch (err) {
        setMovie(null);
        setError(
          err instanceof Error ? err.message : "ไม่สามารถโหลดรายละเอียดภาพยนตร์ได้"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetail();
  }, [movieId]);

  return (
    <main className="min-h-screen bg-[#04150e] text-white">
      <nav className="fixed inset-x-0 top-0 z-50 flex h-[72px] w-full items-center bg-[#06160a] px-8">
        <Link
          href="/User/Home"
          className="mr-12 font-serif text-3xl font-normal text-[#63e86f]"
        >
          Emerald Cinema
        </Link>

        <div className="flex items-center gap-10 text-sm font-medium text-gray-200">
          <Link href="/User/Home" className="transition hover:text-[#63e86f]">
            หน้าหลัก
          </Link>

          <Link href="/User/Movies" className="transition hover:text-[#63e86f]">
            ภาพยนตร์
          </Link>

          <Link
            href="/User/Promotion"
            className="transition hover:text-[#63e86f]"
          >
            โปรโมชั่น
          </Link>

          <Link href="/User/Ticket" className="transition hover:text-[#63e86f]">
            ตั๋วของฉัน
          </Link>
        </div>

        <Link
          href="/User/Profile"
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#63e86f] text-sm text-[#63e86f] transition hover:bg-[#63e86f] hover:text-black"
        >
          ◎
        </Link>
      </nav>

      <section className="mx-auto w-full max-w-[1480px] px-8 pb-16 pt-28">
        {loading && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-[#172319] px-6 py-5 text-base text-white/70">
            กำลังโหลดรายละเอียดภาพยนตร์...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-950/30 px-6 py-5 text-base text-red-100">
            ไม่สามารถโหลดรายละเอียดภาพยนตร์ได้: {error}
          </div>
        )}

        {!loading && !error && movie && (
          <>
            <div className="relative w-full overflow-hidden rounded-[30px] bg-[#111] shadow-2xl">
              <div className="relative h-[430px] w-full md:h-[520px] lg:h-[620px]">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-full w-full object-cover object-center"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/5" />

                <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 lg:bottom-10 lg:left-10">
                  <span className="inline-flex rounded-full bg-[#f4c542] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-black md:text-xs">
                    Now Showing
                  </span>

                  <h1 className="mt-3 text-4xl font-extrabold leading-none tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                    {movie.title}
                  </h1>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-white/80 md:text-base">
                {movie.rating !== null && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#f4c542]">★</span>
                      <span className="font-bold text-white">{movie.rating}</span>
                    </div>

                    <span>•</span>
                  </>
                )}

                <span>{movie.ageRate}</span>

                <span>•</span>
                <span>{movie.durationLabel}</span>

                <span>•</span>
                <span>{movie.releaseDate}</span>

                <span>•</span>
                <span className="text-[#4EBD5A]">{movie.genres.join(" / ")}</span>
              </div>

              <Link
                href={`/User/Booking?movieId=${movie.id}`}
                className="inline-flex w-fit items-center justify-center rounded-full bg-[#4EBD5A] px-8 py-3.5 text-base font-bold text-black transition hover:scale-[1.02] hover:bg-[#67d873]"
              >
                ดูรอบฉายทั้งหมด
                <span className="ml-2">▣</span>
              </Link>
            </div>

            <section className="mt-9 max-w-[950px]">
              <h2 className="mb-4 text-3xl font-bold">เรื่องย่อ</h2>
              <p className="text-base leading-8 text-white/75 md:text-lg">
                {movie.description}
              </p>
            </section>

            {movie.director.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-5 text-3xl font-bold">ผู้กำกับ</h2>

                <div className="flex flex-wrap gap-6">
                  {movie.director.map((person) => (
                    <div
                      key={person.id}
                      className="w-[180px] rounded-2xl bg-[#172319] px-5 py-6"
                    >
                      <p className="line-clamp-2 text-lg font-bold text-white">
                        {person.name}
                      </p>
                      <p className="mt-2 text-sm text-white/55">{person.role}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {movie.cast.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-5 text-3xl font-bold">นักแสดง</h2>

                <div className="flex flex-wrap gap-6">
                  {movie.cast.map((person) => (
                    <div
                      key={person.id}
                      className="w-[180px] rounded-2xl bg-[#172319] px-5 py-6"
                    >
                      <p className="line-clamp-2 text-lg font-bold text-white">
                        {person.name}
                      </p>
                      <p className="mt-2 text-sm text-white/55">{person.role}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
