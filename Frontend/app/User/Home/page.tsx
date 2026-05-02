"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getMovies } from "@/services/api";
import type { MovieCard } from "@/types/movie";

export default function HomePage() {
  const promotions = [
    {
      title: "Movie Night Combo",
      desc: "ลด 50% สำหรับชุดป๊อปคอร์นและเครื่องดื่ม 2 ที่นั่งขึ้นไป",
      image: "/image/Movie Night Combo.png",
      tag: "HOT",
    },
    {
      title: "Emerald Member Card",
      desc: "สมัครสมาชิกวันนี้ รับสิทธิพิเศษทุกครั้งที่ 1 เรื่องขึ้นไป",
      image: "/image/Emerald Member Card.png",
      tag: "HOT",
    },
    {
      title: "Early Bird Ticket",
      desc: "จองล่วงหน้า รับส่วนลดพิเศษสำหรับรอบเช้า",
      image: "/image/Early Bird Tickets.png",
      tag: "HOT",
    },
  ];

  const categories = [
    "All",
    "Action",
    "Horror",
    "Sci-Fi",
    "Drama",
    "Fantasy",
    "Adventure",
    "Comedy",
  ];

  const [movies, setMovies] = useState<MovieCard[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
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
        setError(err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลภาพยนตร์ได้");
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    if (selectedCategory === "All") {
      return movies;
    }

    const normalizedCategory = selectedCategory.trim().toLowerCase();

    return movies.filter((movie) => {
      const genreText = movie.genre.trim().toLowerCase();
      const genreList = movie.genres.map((genre) => genre.trim().toLowerCase());

      return (
        genreText.includes(normalizedCategory) ||
        genreList.some((genre) => genre.includes(normalizedCategory))
      );
    });
  }, [movies, selectedCategory]);

  const nowPlayingMovies = useMemo(
    () => filteredMovies.slice(0, 4),
    [filteredMovies]
  );

  const topMovies = useMemo(() => {
    return [...movies]
      .sort((a, b) => (b.scoreRating ?? 0) - (a.scoreRating ?? 0))
      .slice(0, 5);
  }, [movies]);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#06160a] text-white">
      <nav className="flex h-[72px] w-full items-center bg-[#06160a] px-8">
        <h1 className="mr-12 font-serif text-3xl font-normal text-[#63e86f]">
          Emerald Cinema
        </h1>

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
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#63e86f] text-sm text-[#63e86f] transition hover:bg-[#63e86f] hover:text-[#06160a]"
        >
          ◎
        </Link>
      </nav>

      <section className="grid w-full grid-cols-[minmax(0,1fr)_290px] gap-8 px-8 pb-12 pt-10">
        <div className="min-w-0">
          <section className="mb-14">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-4xl font-black">โปรโมชั่นพิเศษ</h2>

              <Link href="/User/Movies" className="text-base font-bold text-[#63e86f]">
                ดูทั้งหมด
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-7">
              {promotions.map((promo) => (
                <article
                  key={promo.title}
                  className="overflow-hidden rounded-[24px] bg-[#273028]"
                >
                  <div className="relative h-[150px] w-full">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="h-full w-full object-cover object-center"
                    />

                    <span className="absolute right-4 top-4 rounded-full bg-yellow-400 px-4 py-1 text-xs font-black text-black">
                      {promo.tag}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-2 text-xl font-black">{promo.title}</h3>

                    <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-gray-300">
                      {promo.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-4xl font-black">ภาพยนตร์ที่กำลังฉาย</h2>

              <Link
                href="/User/Movies"
                className="text-base font-bold text-[#63e86f]"
              >
                ดูทั้งหมด
              </Link>
            </div>

            {loading && (
              <div className="rounded-2xl border border-white/10 bg-[#172319] px-6 py-5 text-sm text-white/70">
                กำลังโหลดข้อมูลภาพยนตร์...
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-400/30 bg-red-950/30 px-6 py-5 text-sm text-red-100">
                ไม่สามารถโหลดข้อมูลภาพยนตร์ได้: {error}
              </div>
            )}

            {!loading && !error && nowPlayingMovies.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#172319] px-6 py-5 text-sm text-white/70">
                {selectedCategory === "All"
                  ? "ขณะนี้ยังไม่มีภาพยนตร์เข้าฉาย"
                  : `ยังไม่พบภาพยนตร์ในหมวด ${selectedCategory}`}
              </div>
            )}

            {!loading && !error && nowPlayingMovies.length > 0 && (
              <div className="grid grid-cols-4 gap-8">
                {nowPlayingMovies.map((movie) => (
                  <article key={movie.id} className="w-full">
                    <Link
                      href={`/User/Movie-detail?movieId=${movie.id}`}
                      className="group block"
                    >
                      <div className="mb-4 flex h-[420px] w-full items-center justify-center overflow-hidden rounded-[22px] bg-[#172319] transition group-hover:scale-[1.01] group-hover:ring-2 group-hover:ring-[#63e86f]/80">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="h-full w-full object-contain object-center transition duration-300 group-hover:scale-[1.02]"
                        />
                      </div>

                      <h3 className="mb-4 text-base font-black transition group-hover:text-[#63e86f]">
                        {movie.title}
                      </h3>
                    </Link>

                    <Link
                      href={`/User/Booking?movieId=${movie.id}`}
                      className="flex w-full items-center justify-center rounded-full bg-[#63e86f] py-4 text-sm font-black text-black transition hover:bg-[#4ebd5a]"
                    >
                      จองตั๋ว
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-7">
          <section className="rounded-[28px] bg-[#172319] p-7">
            <h3 className="mb-7 text-2xl font-black">Top 5 หนังฮิต</h3>

            <div className="space-y-5">
              {topMovies.map((movie, index) => (
                <div key={movie.id} className="flex items-center gap-4">
                  <div className="w-9 text-4xl font-black text-yellow-400">
                    {index + 1}
                  </div>

                  <Link
                    href={`/User/Movie-detail?movieId=${movie.id}`}
                    className="flex min-w-0 items-center gap-4 transition hover:opacity-90"
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="h-[62px] w-[46px] rounded-md object-cover object-center"
                    />

                    <p className="text-sm font-black leading-tight transition hover:text-[#63e86f]">
                      {movie.title}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-[#172319] p-7">
            <h3 className="mb-7 text-2xl font-black">หมวดหมู่</h3>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
                    selectedCategory === category
                      ? "bg-[#63e86f] text-black"
                      : "bg-[#273028] text-white hover:bg-[#4ebd5a] hover:text-black"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
