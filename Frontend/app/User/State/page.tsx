"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getMovieById, getSeatsByShowtimeId } from "@/services/api";
import type { MovieDetail } from "@/types/movie";
import type { SeatLayoutSeat } from "@/types/seat";

type SeatStatus = "standard" | "premium" | "unavailable";

function SeatIcon({
  status,
  selected = false,
  small = false,
  onClick,
}: {
  status: SeatStatus;
  selected?: boolean;
  small?: boolean;
  onClick?: () => void;
}) {
  const isUnavailable = status === "unavailable";
  const isPremium = status === "premium";

  const color = isUnavailable
    ? "text-[#D4E9D2]"
    : selected
    ? "text-[#6FDE76]"
    : isPremium
    ? "text-[#FFD34E]"
    : "text-[#D4E9D2]";

  const iconSize = small ? 24 : 40;
  const boxClass = small ? "h-8 w-8" : "h-14 w-14";

  return (
    <button
      type="button"
      disabled={isUnavailable}
      onClick={onClick}
      className={`flex ${boxClass} items-center justify-center transition ${
        isUnavailable
          ? "cursor-not-allowed opacity-45"
          : "cursor-pointer hover:scale-105"
      } ${color}`}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isUnavailable ? (
          <>
            <circle cx="12" cy="7" r="3" />
            <path d="M6.5 19v-1.2c0-2.7 2.4-4.8 5.5-4.8s5.5 2.1 5.5 4.8V19" />
          </>
        ) : (
          <>
            <path d="M7 11V7.5A1.5 1.5 0 0 1 8.5 6h7A1.5 1.5 0 0 1 17 7.5V11" />
            <path d="M5.5 11h13v5.5h-13z" />
            <path d="M8 16.5V19" />
            <path d="M16 16.5V19" />
            <path d="M4.5 19h15" />
          </>
        )}
      </svg>
    </button>
  );
}

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s6-4.8 6-10a6 6 0 1 0-12 0c0 5.2 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8v4l2.5 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 3L10 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 3L15 21l-5-7-7-5 18-6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18v3a2 2 0 1 0 0 4v3H6.5A2.5 2.5 0 0 1 4 13.5v-5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M14 6v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="2 2"
      />
    </svg>
  );
}

export default function StatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showtimeId = searchParams.get("showtimeId");
  const movieId = searchParams.get("movieId");

  const [code, setCode] = useState("");
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [seats, setSeats] = useState<SeatLayoutSeat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSeatLayout() {
      try {
        if (!showtimeId) {
          throw new Error("ไม่พบรหัสรอบฉาย");
        }

        setLoading(true);
        setError(null);

        const [seatData, movieData] = await Promise.all([
          getSeatsByShowtimeId(showtimeId),
          movieId ? getMovieById(movieId) : Promise.resolve(null),
        ]);

        setSeats(seatData);
        setMovie(movieData);
      } catch (err) {
        setSeats([]);
        setMovie(null);
        setError(
          err instanceof Error ? err.message : "ไม่สามารถโหลดผังที่นั่งได้"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSeatLayout();
  }, [movieId, showtimeId]);

  const rows = useMemo(
    () => Array.from(new Set(seats.map((seat) => seat.row))),
    [seats]
  );

  const seatsById = useMemo(
    () => Object.fromEntries(seats.map((seat) => [seat.id, seat])),
    [seats]
  );

  const selectedSeatData = useMemo(
    () => selectedSeats.map((seatId) => seatsById[seatId]).filter(Boolean),
    [selectedSeats, seatsById]
  );

  const total = selectedSeatData.reduce((sum, seat) => sum + seat.price, 0);

  function toggleSeat(seatId: string) {
    const seat = seatsById[seatId];
    if (!seat || seat.status === "unavailable") {
      return;
    }

    setSelectedSeats((current) =>
      current.includes(seatId)
        ? current.filter((id) => id !== seatId)
        : [...current, seatId]
    );
  }

  function handlePurchase() {
    if (!showtimeId || selectedSeats.length === 0) {
      return;
    }

    const params = new URLSearchParams({
      showtimeId,
      seatIds: selectedSeats.join(","),
      totalPrice: String(total),
    });

    if (movieId) {
      params.set("movieId", movieId);
    }

    router.push(`/User/Payment?${params.toString()}`);
  }

  return (
    <main className="min-h-screen w-full bg-[#061008] text-[#D4E9D2]">
      <div className="mx-auto w-full px-8 pb-8 pt-1">
        <nav className="flex h-[78px] items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              href="/User/Home"
              className="font-serif text-[34px] uppercase tracking-wide text-[#6FDE76]"
            >
              Emerald Cinema
            </Link>

            <div className="flex items-center gap-10 text-[16px] font-medium text-[#D4E9D2]">
              <Link href="/User/Home" className="transition hover:text-[#6FDE76]">
                หน้าหลัก
              </Link>
              <Link href="/User/Movies" className="transition hover:text-[#6FDE76]">
                ภาพยนตร์
              </Link>
              <Link
                href="/User/Promotion"
                className="transition hover:text-[#6FDE76]"
              >
                โปรโมชั่น
              </Link>
              <Link href="/User/Ticket" className="transition hover:text-[#6FDE76]">
                ตั๋วของฉัน
              </Link>
            </div>
          </div>

          <Link
            href="/User/Profile"
            className="text-[#6FDE76] transition hover:scale-105"
          >
            ◎
          </Link>
        </nav>

        {loading && (
          <div className="mt-6 rounded-[28px] bg-[#121F15] px-6 py-5 text-sm text-[#D4E9D2]/80">
            กำลังโหลดผังที่นั่ง...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-[28px] border border-red-400/30 bg-red-950/30 px-6 py-5 text-sm text-red-100">
            ไม่สามารถโหลดผังที่นั่งได้: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="relative min-h-[760px] rounded-[38px] bg-[#0E1C12] px-14 pb-10 pt-16 shadow-[inset_0_0_50px_rgba(78,189,90,0.05)]">
              <div className="mx-auto mt-4 h-[8px] w-[78%] rounded-full bg-[#4EBD5A]/80 shadow-[0_0_28px_rgba(78,189,90,0.45)]" />

              <p className="mt-5 text-center text-[16px] font-semibold text-[#D4E9D2]">
                หน้าจอ
              </p>

              {seats.length === 0 ? (
                <div className="mt-24 text-center text-sm text-[#D4E9D2]/70">
                  ยังไม่มีข้อมูลผังที่นั่งสำหรับรอบฉายนี้
                </div>
              ) : (
                <div className="mx-auto mt-24 w-fit space-y-7">
                  {rows.map((row) => {
                    const rowSeats = seats.filter((seat) => seat.row === row);
                    const midpoint = Math.ceil(rowSeats.length / 2);

                    return (
                      <div
                        key={row}
                        className="grid grid-cols-[30px_repeat(4,56px)_86px_repeat(4,56px)_30px] items-center gap-5"
                      >
                        <span className="text-[17px] font-semibold text-[#D4E9D2]">
                          {row}
                        </span>

                        {rowSeats.slice(0, midpoint).map((seat) => (
                          <SeatIcon
                            key={seat.id}
                            status={seat.status}
                            selected={selectedSeats.includes(seat.id)}
                            onClick={() => toggleSeat(seat.id)}
                          />
                        ))}

                        <div />

                        {rowSeats.slice(midpoint).map((seat) => (
                          <SeatIcon
                            key={seat.id}
                            status={seat.status}
                            selected={selectedSeats.includes(seat.id)}
                            onClick={() => toggleSeat(seat.id)}
                          />
                        ))}

                        <span className="text-[17px] font-semibold text-[#D4E9D2]">
                          {row}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="absolute bottom-12 left-1/2 flex w-[88%] -translate-x-1/2 items-center justify-between rounded-full bg-[#17251A] px-12 py-5 text-[13px]">
                <div className="flex items-center gap-3 text-[#D4E9D2]">
                  <SeatIcon status="standard" small />
                  <span>STANDARD (200฿)</span>
                </div>

                <div className="flex items-center gap-3 text-[#FFD34E]">
                  <SeatIcon status="premium" small />
                  <span>PREMIUM (250฿)</span>
                </div>

                <div className="flex items-center gap-3 text-[#6FDE76]">
                  <SeatIcon status="standard" selected small />
                  <span>SELECTED</span>
                </div>

                <div className="flex items-center gap-3 text-[#D4E9D2]">
                  <SeatIcon status="unavailable" small />
                  <span>UNAVAILABLE</span>
                </div>
              </div>
            </section>

            <aside className="rounded-[38px] bg-[#121F15] px-8 py-9 shadow-[0_20px_60px_rgba(0,0,0,0.45),inset_0_0_40px_rgba(78,189,90,0.06)]">
              <div>
                <h2 className="text-[18px] font-bold text-[#FFD34E]">
                  สรุปการจอง
                </h2>
                <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#D4E9D2]/75">
                  Emerald Cinema
                </p>
              </div>

              <div className="my-7 h-px bg-[#223125]" />

              <div className="flex items-center gap-4">
                <img
                  src={movie?.poster ?? "/image/jujutsu.jpg"}
                  alt={movie?.title ?? "Movie poster"}
                  className="h-[140px] w-[96px] rounded-[28px] object-cover"
                />

                <div>
                  <h3 className="text-[20px] font-semibold text-white">
                    {movie?.title ?? "กำลังโหลดภาพยนตร์"}
                  </h3>

                  <div className="mt-3 space-y-2 text-[14px] text-[#D4E9D2]">
                    <p>☆ EN/TH</p>
                    <div className="flex items-center gap-2">
                      <ClockIcon />
                      <span>{movie?.durationLabel ?? "-"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[28px] bg-[#3B463B] px-6 py-5">
                <div className="flex items-center gap-3 text-[#6FDE76]">
                  <LocationIcon />
                  <span className="text-[15px] font-semibold text-[#D4E9D2]">
                    Standard Theater Layout
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.15em] text-[#D4E9D2]/65">
                      Date & Time
                    </p>
                  </div>
                  <p className="text-[16px] font-bold text-white">
                    Showtime #{showtimeId ?? "-"}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-7">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] text-[#D4E9D2]/80">
                    จำนวนที่นั่ง
                  </span>
                  <span className="text-[16px] font-bold text-[#6FDE76]">
                    {selectedSeats.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[15px] text-[#D4E9D2]/80">
                    ที่นั่งที่เลือก
                  </span>
                  <span className="text-right text-[16px] font-bold text-[#6FDE76]">
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}
                  </span>
                </div>

                <div className="h-px bg-[#223125]" />

                <div className="flex items-center justify-between">
                  <span className="text-[15px] text-[#D4E9D2]/80">
                    จำนวนเงินทั้งหมด
                  </span>
                  <span className="text-[24px] font-bold text-[#FFD34E]">
                    {total} ฿
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center rounded-[10px] bg-[#4B5E4E] px-4 py-4">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Code..."
                  className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-[#D4E9D2]/45"
                />
                <button type="button" className="text-[#D4E9D2]/85">
                  <SendIcon />
                </button>
              </div>

              <button
                type="button"
                disabled={selectedSeats.length === 0 || !showtimeId}
                onClick={handlePurchase}
                className={`mt-10 flex w-full items-center justify-center gap-3 rounded-full py-5 text-[18px] font-bold shadow-[0_12px_30px_rgba(111,222,118,0.35)] transition ${
                  selectedSeats.length === 0 || !showtimeId
                    ? "cursor-not-allowed bg-[#3f5742] text-[#b7c7b8] shadow-none"
                    : "bg-[#6FDE76] text-[#061008] hover:bg-[#5ad764]"
                }`}
              >
                <span>ซื้อตั๋ว</span>
                <TicketIcon />
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
