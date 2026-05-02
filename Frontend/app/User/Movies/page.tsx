"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getMovies } from "@/services/api";
import type { MovieCard } from "@/types/movie";

export default function MoviesPage() {
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");
  const [movies, setMovies] = useState<MovieCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "ไม่สามารถดึงข้อมูลภาพยนตร์ได้"
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  const visibleMovies = movies.filter((movie) => {
    if (activeCategory === "ทั้งหมด") {
      return true;
    }

    return movie.genres.some(
      (genre) => genre.toLowerCase() === activeCategory.toLowerCase()
    );
  });

  return (
    <main className="min-h-screen bg-[#06160a] text-white">
      <nav className="flex h-[72px] w-full items-center bg-[#06160a] px-8">
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
          <Link href="/User/Movies" className="text-[#63e86f]">
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
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#63e86f] text-sm text-[#63e86f] transition hover:bg-[#63e86f] hover:text-[#06160a]"
        >
          ◎
        </Link>
      </nav>

      <section className="mx-auto max-w-[1200px] px-8 py-10">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-4xl font-black">ภาพยนตร์ที่กำลังฉาย</h2>

          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              "ทั้งหมด",
              "Action",
              "Anime",
              "Fantasy",
              "Horror",
              "Sports",
              "Drama",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setActiveCategory(item)}
                className={`rounded-full px-6 py-3 text-[14px] font-semibold transition duration-200 ${
                  activeCategory === item
                    ? "bg-[#63e86f] text-[#06160a]"
                    : "bg-[#2c352e] text-white hover:bg-[#63e86f] hover:text-[#06160a]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#172319] px-6 py-5 text-sm text-white/70">
            กำลังโหลดข้อมูลภาพยนตร์...
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-400/30 bg-red-950/30 px-6 py-5 text-sm text-red-100">
            ไม่สามารถโหลดข้อมูลภาพยนตร์ได้: {error}
          </div>
        )}

        {!loading && !error && visibleMovies.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#172319] px-6 py-5 text-sm text-white/70">
            ไม่พบภาพยนตร์ในหมวดหมู่นี้
          </div>
        )}

        {!loading && !error && visibleMovies.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              alignItems: "flex-start",
              width: "100%",
              marginTop: "32px",
            }}
          >
            {visibleMovies.map((movie) => (
              <article
                key={movie.id}
                style={{
                  width: "240px",
                  height: "430px",
                  backgroundColor: "#172319",
                  borderRadius: "20px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "340px",
                    overflow: "hidden",
                    backgroundColor: "black",
                  }}
                >
                  <Link
                    href={`/User/Movie-detail?movieId=${movie.id}`}
                    className="block h-full w-full cursor-pointer overflow-hidden transition-opacity hover:opacity-80"
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="h-full w-full transition-transform duration-300 hover:scale-105"
                      style={{
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Link>
                </div>

                <div className="flex flex-1 flex-col px-4 py-4">
                  <h3 className="line-clamp-2 min-h-[48px] text-center text-[15px] font-semibold leading-tight">
                    {movie.title}
                  </h3>

                  <div className="flex flex-1 items-center">
                    <div className="flex w-full justify-between gap-3 text-[13px] text-gray-300">
                      <span className="line-clamp-1">{movie.genre}</span>
                      <span>{movie.durationLabel}</span>
                    </div>
                  </div>

                  <Link
                    href={`/User/Booking?movieId=${movie.id}`}
                    className="mt-4 flex h-[46px] w-full items-center justify-center rounded-full bg-[#63e86f] text-[15px] font-semibold text-[#06160a]"
                  >
                    จองตั๋ว
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
