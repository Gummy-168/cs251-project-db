"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, Star } from "lucide-react";

import { getMovieById, getShowtimesByMovieId } from "@/services/api";
import type { MovieShowtimeDateGroup } from "@/types/booking";
import type { MovieDetail } from "@/types/movie";

function formatDateChip(showDate: string, index: number) {
  const date = new Date(showDate);
  const today = new Date();
  const isSameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const weekday = new Intl.DateTimeFormat("th-TH", {
    weekday: "short",
  }).format(date);

  return {
    label: isSameDay && index === 0 ? "วันนี้" : weekday.replace(".", ""),
    date: new Intl.DateTimeFormat("th-TH", {
      day: "2-digit",
    }).format(date),
  };
}

function isShowtimeExpired(showDate: string, startTime: string) {
  const now = new Date();
  const [year, month, day] = showDate.split("-").map(Number);
  const [hours, minutes] = startTime.split(":").map(Number);

  const showtimeDate = new Date(year, month - 1, day, hours, minutes);
  const showDateOnly = new Date(year, month - 1, day);
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (showDateOnly.getTime() > todayOnly.getTime()) {
    return false;
  }

  if (showDateOnly.getTime() < todayOnly.getTime()) {
    return true;
  }

  return showtimeDate.getTime() <= now.getTime();
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("movieId");

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [showtimeGroups, setShowtimeGroups] = useState<MovieShowtimeDateGroup[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookingData() {
      try {
        if (!movieId) {
          throw new Error("ไม่พบรหัสภาพยนตร์");
        }

        setLoading(true);
        setError(null);

        const [movieData, showtimeData] = await Promise.all([
          getMovieById(movieId),
          getShowtimesByMovieId(movieId),
        ]);

        setMovie(movieData);
        setShowtimeGroups(showtimeData);
        setSelectedDate(showtimeData[0]?.showDate ?? null);
      } catch (err) {
        setMovie(null);
        setShowtimeGroups([]);
        setSelectedDate(null);
        setError(
          err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลรอบฉายได้"
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookingData();
  }, [movieId]);

  const visibleDateGroup = useMemo(() => {
    return (
      showtimeGroups.find((group) => group.showDate === selectedDate) ?? null
    );
  }, [selectedDate, showtimeGroups]);

  const filteredBranches = useMemo(() => {
    if (!visibleDateGroup) {
      return [];
    }

    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return visibleDateGroup.branches;
    }

    return visibleDateGroup.branches.filter((branch) => {
      const haystack = `${branch.name} ${branch.location} ${branch.theaters
        .map((theater) => `${theater.name} ${theater.format ?? ""}`)
        .join(" ")}`.toLowerCase();

      return haystack.includes(keyword);
    });
  }, [searchTerm, visibleDateGroup]);

  return (
    <main className="min-h-screen w-full bg-[#071008] text-[#d4e9d2]">
      <header className="flex h-[88px] w-full items-center justify-start gap-16 px-8">
        <Link
          href="/User/Home"
          className="font-serif text-[30px] font-normal tracking-wide text-[#D4F9D2]"
        >
          EMERALD CINEMA
        </Link>

        <nav className="flex items-center gap-12 text-[16px] font-normal text-[#F1F7EF]">
          <Link href="/User/Home" className="transition hover:text-[#4EBD5A]">
            หน้าหลัก
          </Link>
          <Link href="/User/Movies" className="transition hover:text-[#4EBD5A]">
            ภาพยนตร์
          </Link>
          <Link
            href="/User/Promotion"
            className="transition hover:text-[#4EBD5A]"
          >
            โปรโมชั่น
          </Link>
          <Link href="/User/Ticket" className="transition hover:text-[#4EBD5A]">
            ตั๋วของฉัน
          </Link>
        </nav>
      </header>

      <section className="w-full px-8 pb-14 pt-5 xl:px-12">
        {loading && (
          <div className="mb-8 rounded-[28px] border border-white/10 bg-[#101c13] px-6 py-5 text-sm text-[#d4e9d2]/80">
            กำลังโหลดข้อมูลภาพยนตร์และรอบฉาย...
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-[28px] border border-red-400/30 bg-red-950/30 px-6 py-5 text-sm text-red-100">
            ไม่สามารถโหลดข้อมูลได้: {error}
          </div>
        )}

        {!loading && !error && movie && (
          <>
            <div className="mb-12 grid w-full grid-cols-[280px_1fr] gap-8 xl:grid-cols-[300px_1fr] xl:gap-10">
              <div>
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={250}
                  height={380}
                  priority
                  className="h-[380px] w-[250px] rounded-[22px] object-cover shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
                />
              </div>

              <div className="flex max-w-[900px] flex-col justify-center">
                <p className="mb-3 text-[14px] font-medium text-[#d4e9d2]/75">
                  {movie.durationLabel} <span className="mx-1">•</span>{" "}
                  {movie.genres.join(" / ")}
                </p>

                <h2 className="mb-5 text-[58px] font-extrabold leading-none tracking-[-0.04em] text-[#eef8eb]">
                  {movie.title}
                </h2>

                <p className="mb-6 max-w-[850px] text-[15px] leading-7 text-[#d4e9d2]/80">
                  {movie.description}
                </p>

                <div className="flex items-center gap-3">
                  {movie.rating !== null && (
                    <div className="flex items-center gap-2 rounded-full bg-[#273028] px-4 py-2 text-[13px] font-bold text-[#eef8eb]">
                      <Star className="h-4 w-4 fill-[#f5c54b] text-[#f5c54b]" />
                      {movie.rating} / 10
                    </div>
                  )}

                  <div className="flex items-center gap-2 rounded-full bg-[#214824] px-4 py-2 text-[13px] font-bold text-[#eef8eb]">
                    <span className="h-3 w-3 rounded-sm bg-[#4EBD5A]" />
                    {movie.ageRate}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-7">
              <h3 className="mb-5 text-[24px] font-extrabold text-[#4EBD5A]">
                เลือกเวลาฉาย
              </h3>

              <div className="flex flex-wrap gap-4">
                {showtimeGroups.map((item, index) => {
                  const chip = formatDateChip(item.showDate, index);
                  const isActive = item.showDate === selectedDate;

                  return (
                    <button
                      key={item.showDate}
                      onClick={() => setSelectedDate(item.showDate)}
                      className={`flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full transition ${
                        isActive
                          ? "bg-[#58D96B] text-[#071008] shadow-[0_0_28px_rgba(88,217,107,0.42)]"
                          : "bg-[#273028] text-[#d4e9d2] hover:bg-[#354338]"
                      }`}
                    >
                      <span className="mb-1 text-[11px] font-semibold">
                        {chip.label}
                      </span>
                      <span className="text-[25px] font-black leading-none">
                        {chip.date}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-8 flex h-[48px] w-full max-w-[720px] items-center gap-3 rounded-full border border-[#2f6b34] bg-[#101c13] px-5">
              <Search className="h-5 w-5 text-[#4EBD5A]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="ค้นหาสาขาหรือโรงภาพยนตร์"
                className="w-full bg-transparent text-[13px] text-[#d4e9d2] outline-none placeholder:text-[#d4e9d2]/40"
              />
            </div>

            {filteredBranches.length === 0 ? (
              <div className="rounded-[36px] bg-[#232C24] px-7 py-6 text-sm text-[#d4e9d2]/80">
                ไม่พบรอบฉายสำหรับวันที่หรือคำค้นหานี้
              </div>
            ) : (
              <div className="w-full space-y-6">
                {filteredBranches.map((branch) =>
                  branch.theaters.map((theater) => (
                    <div
                      key={`${branch.id}-${theater.id}`}
                      className="w-full rounded-[36px] bg-[#232C24] px-7 py-6"
                    >
                      <div className="mb-8 flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-[25px] font-extrabold leading-none text-[#eef8eb]">
                            {branch.name}
                          </h4>

                          <div className="mt-2 flex items-center gap-1 text-[13px] text-white">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {branch.location} • {theater.name}
                            </span>
                          </div>
                        </div>

                        {theater.format ? (
                          <span className="rounded-md bg-[#536653] px-8 py-2 text-[12px] font-bold text-[#58D96B]">
                            {theater.format}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {theater.showtimes.map((showtime, index) => {
                          const isDisabled = isShowtimeExpired(
                            visibleDateGroup?.showDate ?? "",
                            showtime.startTime
                          );
                          const baseClass =
                            index < 2
                              ? "bg-[#202622] text-[#eef8eb]"
                              : "bg-[#536653] text-[#eef8eb]";

                          if (isDisabled) {
                            return (
                              <div
                                key={showtime.id}
                                aria-disabled="true"
                                className={`flex h-[70px] w-[185px] cursor-not-allowed flex-col items-center justify-center rounded-full opacity-35 ${baseClass}`}
                              >
                                <span className="text-[20px] font-extrabold leading-none">
                                  {showtime.startTime}
                                </span>
                                <span className="mt-2 text-[11px] font-semibold opacity-90">
                                  หมดเวลาแล้ว
                                </span>
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={showtime.id}
                              href={`/User/State?showtimeId=${showtime.id}&movieId=${movie.id}`}
                              className={`flex h-[70px] w-[185px] flex-col items-center justify-center rounded-full transition hover:scale-[1.02] ${baseClass}`}
                            >
                              <span className="text-[20px] font-extrabold leading-none">
                                {showtime.startTime}
                              </span>
                              <span className="mt-2 text-[11px] font-semibold opacity-90">
                                {showtime.language}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
