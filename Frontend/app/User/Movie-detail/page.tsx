"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Person = {
  id: number;
  name: string;
  role: string;
  image: string;
  objectPosition?: string;
};

type MovieDetail = {
  id: number;
  title: string;
  poster: string;
  trailerUrl: string;
  rating: number;
  votes: number;
  duration: string;
  ageRate: string;
  genres: string[];
  description: string;
  director: Person[];
  voiceActors: Person[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const mockMovie: MovieDetail = {
  id: 1,
  title: "Jujutsu Kaisen 0",
  poster: "/image/Jujutsu Kaisen 0.png.webp",
  trailerUrl: "https://www.youtube.com/watch?v=UPRqnFnnrr8",
  rating: 8.9,
  votes: 2569,
  duration: "105 นาที",
  ageRate: "13+",
  genres: ["Action", "Animation"],
  description:
    "เรื่องราวของ ยูตะ โอคคตสึ เด็กหนุ่มที่ถูกคำสาปร้ายติดตามจากวิญญาณของริกะ เพื่อนสมัยเด็กที่จากไป ยูตะจึงได้เข้าเรียนที่โรงเรียนไสยเวทโตเกียว เพื่อเรียนรู้การควบคุมพลังคำสาป ปกป้องตนเองและคนรอบข้าง พร้อมทั้งเผชิญหน้ากับศัตรูที่อันตราย",
  director: [
    {
      id: 1,
      name: "Sunghoo park",
      role: "ผู้กำกับ",
      image: "/image/Sunghoo park.jpg",
      objectPosition: "center",
    },
  ],
  voiceActors: [
    {
      id: 1,
      name: "Junya Enoki",
      role: "นักพากย์",
      image: "/image/Junya Enoki.jpg",
      objectPosition: "center top",
    },
    {
      id: 2,
      name: "Yuma Uchida",
      role: "นักพากย์",
      image: "/image/Yuma Uchida.webp",
      objectPosition: "center",
    },
    {
      id: 3,
      name: "Asami Seto",
      role: "นักพากย์",
      image: "/image/Asami Seto.webp",
      objectPosition: "center",
    },
  ],
};

export default function MovieDetailPage() {
  const [movie, setMovie] = useState<MovieDetail>(mockMovie);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovieDetail() {
      try {
        const res = await fetch(`${API_URL}/movies/1`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Cannot fetch movie detail");
        }

        const data = await res.json();

        setMovie({
          ...mockMovie,
          ...data,
          director: data?.director?.length ? data.director : mockMovie.director,
          voiceActors: data?.voiceActors?.length
            ? data.voiceActors
            : mockMovie.voiceActors,
        });
      } catch (error) {
        console.log("Using mock movie detail because backend is not ready:", error);
        setMovie(mockMovie);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetail();
  }, []);

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
          <p className="mb-4 text-base text-white/60">กำลังโหลดข้อมูล...</p>
        )}

        <div className="relative w-full overflow-hidden rounded-[30px] bg-[#111] shadow-2xl">
          <div className="relative h-[430px] w-full md:h-[520px] lg:h-[620px]">
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/5" />

            <a
              href={movie.trailerUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#4EBD5A] text-2xl text-black shadow-xl transition hover:scale-105 hover:bg-[#67d873] md:h-20 md:w-20 md:text-3xl"
            >
              ▶
            </a>

            <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 lg:bottom-10 lg:left-10">
              <span className="inline-flex rounded-full bg-[#f4c542] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-black md:text-xs">
                Official Trailer
              </span>

              <h1 className="mt-3 text-4xl font-extrabold leading-none tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {movie.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-white/80 md:text-base">
            <div className="flex items-center gap-1.5">
              <span className="text-[#f4c542]">★</span>
              <span className="font-bold text-white">{movie.rating}</span>
            </div>

            <span>•</span>
            <span>{movie.votes.toLocaleString()} votes</span>

            <span>•</span>
            <span>{movie.ageRate}</span>

            <span>•</span>
            <span>{movie.duration}</span>

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

        <section className="mt-10">
          <h2 className="mb-5 text-3xl font-bold">ผู้กำกับ</h2>

          <div className="flex flex-wrap gap-6">
            {movie.director.map((person) => (
              <div key={person.id} className="w-[180px]">
                <div className="h-[220px] w-full overflow-hidden rounded-2xl bg-[#273028]">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: person.objectPosition || "center" }}
                  />
                </div>

                <p className="mt-3 line-clamp-1 text-lg font-bold text-white">
                  {person.name}
                </p>
                <p className="text-sm text-white/55">{person.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-3xl font-bold">นักพากย์</h2>

          <div className="flex flex-wrap gap-6">
            {movie.voiceActors.map((person) => (
              <div key={person.id} className="w-[180px]">
                <div className="h-[220px] w-full overflow-hidden rounded-2xl bg-[#273028]">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: person.objectPosition || "center" }}
                  />
                </div>

                <p className="mt-3 line-clamp-1 text-lg font-bold text-white">
                  {person.name}
                </p>
                <p className="text-sm text-white/55">{person.role}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}