"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getUserBookings, resolveMovieImage, submitReview } from "@/services/api";
import type {
  BookingReview,
  ReviewRecord,
  UserBookingHistory,
} from "@/types/booking";

function formatThaiDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatThaiTime(value: string) {
  return `${value} น.`;
}

function getShowtimeDateTime(booking: UserBookingHistory) {
  return new Date(`${booking.showDate}T${booking.startTime}:00`);
}

function formatSeatLabel(booking: UserBookingHistory) {
  const seatText = booking.seats
    .map((seat) => `${seat.seatRow}${seat.seatNumber}`)
    .join(",");

  return `Seat No. ${seatText}`;
}

export default function TicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightedBookingId = useMemo(() => {
    const rawBookingId = searchParams.get("bookingId");
    const parsed = Number(rawBookingId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [searchParams]);

  const [bookings, setBookings] = useState<UserBookingHistory[]>([]);
  const [uid, setUid] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      const rawUser = window.localStorage.getItem("emerald_user");

      if (!rawUser) {
        router.replace("/User/Signin?callbackUrl=%2FUser%2FTicket");
        return;
      }

      try {
        const parsedUser = JSON.parse(rawUser) as { UID?: number };

        if (!parsedUser.UID) {
          window.localStorage.removeItem("emerald_user");
          router.replace("/User/Signin?callbackUrl=%2FUser%2FTicket");
          return;
        }

        setUid(parsedUser.UID);
        const userBookings = await getUserBookings(parsedUser.UID);

        if (!cancelled) {
          setBookings(userBookings);
          setError(null);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "ไม่สามารถโหลดประวัติการจองได้"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const { nowPlaying, watched } = useMemo(() => {
    const now = new Date();

    const nextBookings: UserBookingHistory[] = [];
    const watchedBookings: UserBookingHistory[] = [];

    bookings.forEach((booking) => {
      if (getShowtimeDateTime(booking).getTime() >= now.getTime()) {
        nextBookings.push(booking);
      } else {
        watchedBookings.push(booking);
      }
    });

    return {
      nowPlaying: nextBookings,
      watched: watchedBookings,
    };
  }, [bookings]);

  useEffect(() => {
    if (!highlightedBookingId || loading) {
      return;
    }

    const element = cardRefs.current[highlightedBookingId];
    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [highlightedBookingId, loading, bookings]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice(null);
    }, 3200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [notice]);

  function handleReviewSaved(movieId: number, review: ReviewRecord) {
    const normalizedReview: BookingReview = {
      reviewId: review.ReviewID,
      reviewDate: review.ReviewDate,
      reviewScore: review.ReviewScore,
      comment: review.Comment ?? null,
    };

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.movieId === movieId
          ? {
              ...booking,
              review: normalizedReview,
            }
          : booking
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#06160a] text-white">
      {notice && (
        <div
          className={`fixed right-6 top-6 z-50 max-w-sm rounded-2xl border px-5 py-4 text-sm font-semibold shadow-2xl ${
            notice.type === "success"
              ? "border-[#63e86f]/50 bg-[#102014] text-[#d4ffd8]"
              : "border-red-900/60 bg-red-950/90 text-red-100"
          }`}
        >
          {notice.message}
        </div>
      )}

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

          <Link href="/User/Ticket" className="text-[#63e86f]">
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

      <section className="mx-auto max-w-[1000px] px-6 py-12">
        <div className="mb-10">
          <h2 className="text-5xl font-black text-gray-100">ตั๋วของฉัน</h2>
          <p className="mt-2 text-lg font-semibold text-gray-400">
            พบประวัติการจองและตั๋วชมภาพยนตร์ของคุณที่นี่
          </p>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-[#243327] bg-[#102014] px-8 py-10 text-center text-gray-300">
            กำลังโหลดประวัติการจอง...
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-900/50 bg-red-950/40 px-8 py-10 text-center text-red-100">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-[28px] border border-[#243327] bg-[#102014] px-8 py-10 text-center text-gray-300">
            ยังไม่มีประวัติการจองตั๋วในบัญชีนี้
          </div>
        ) : (
          <div className="space-y-12">
            <TicketSection
              title="NOW PLAYING"
              description="ตั๋วที่กำลังจะเข้าฉายหรือเพิ่งจองล่าสุด"
              bookings={nowPlaying}
              highlightedBookingId={highlightedBookingId}
              cardRefs={cardRefs}
              active
            />

            <TicketSection
              title="WATCHED"
              description="ประวัติการรับชมที่ผ่านมา"
              bookings={watched}
              highlightedBookingId={highlightedBookingId}
              cardRefs={cardRefs}
              userId={uid}
              onReviewSaved={handleReviewSaved}
              onNotice={setNotice}
            />
          </div>
        )}
      </section>
    </main>
  );
}

function TicketSection({
  title,
  description,
  bookings,
  highlightedBookingId,
  cardRefs,
  userId,
  onReviewSaved,
  onNotice,
  active = false,
}: {
  title: string;
  description: string;
  bookings: UserBookingHistory[];
  highlightedBookingId: number | null;
  cardRefs: MutableRefObject<Record<number, HTMLDivElement | null>>;
  userId?: number | null;
  onReviewSaved?: (movieId: number, review: ReviewRecord) => void;
  onNotice?: (notice: { type: "success" | "error"; message: string } | null) => void;
  active?: boolean;
}) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-black tracking-[0.24em] text-[#63e86f]">
            {title}
          </h3>
          <p className="mt-2 text-sm font-medium text-gray-400">{description}</p>
        </div>
        <p className="text-sm font-semibold text-gray-500">
          {bookings.length} รายการ
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-[24px] border border-[#243327] bg-[#0e1c11] px-6 py-8 text-center text-sm text-gray-400">
          ไม่มีรายการในหมวดนี้
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              ref={(element) => {
                cardRefs.current[booking.bookingId] = element;
              }}
            >
              <TicketCard
                booking={booking}
                status={title}
                active={active}
                highlighted={booking.bookingId === highlightedBookingId}
                userId={userId}
                onReviewSaved={onReviewSaved}
                onNotice={onNotice}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function TicketCard({
  booking,
  status,
  active = false,
  highlighted = false,
  userId,
  onReviewSaved,
  onNotice,
}: {
  booking: UserBookingHistory;
  status: string;
  active?: boolean;
  highlighted?: boolean;
  userId?: number | null;
  onReviewSaved?: (movieId: number, review: ReviewRecord) => void;
  onNotice?: (notice: { type: "success" | "error"; message: string } | null) => void;
}) {
  const existingReview = booking.review ?? null;
  const [rating, setRating] = useState(existingReview?.reviewScore ?? 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [composerOpen, setComposerOpen] = useState(Boolean(existingReview));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const image = resolveMovieImage({ MName: booking.movieTitle });
  const cinema = `${booking.branchName} - Theater ${String(booking.theaterNumber).padStart(2, "0")}`;
  const isReviewed = Boolean(existingReview);
  const displayedRating = hoveredRating || rating;

  useEffect(() => {
    setRating(existingReview?.reviewScore ?? 0);
    setComment(existingReview?.comment ?? "");
    setComposerOpen(Boolean(existingReview));
    setSubmitError(null);
  }, [existingReview?.reviewId, existingReview?.reviewScore, existingReview?.comment]);

  async function handleSubmitReview() {
    if (!userId) {
      onNotice?.({
        type: "error",
        message: "กรุณาเข้าสู่ระบบใหม่ก่อนให้คะแนนภาพยนตร์",
      });
      return;
    }

    if (isReviewed || rating < 1 || rating > 5) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const review = await submitReview({
        UID: userId,
        MID: booking.movieId,
        ReviewScore: rating,
        Comment: comment.trim() || null,
      });

      onReviewSaved?.(booking.movieId, review);
      onNotice?.({
        type: "success",
        message: `บันทึกคะแนน ${rating} ดาวให้ ${booking.movieTitle} เรียบร้อยแล้ว`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "ไม่สามารถบันทึกรีวิวได้";
      setSubmitError(message);
      onNotice?.({
        type: "error",
        message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article
      className={`relative grid overflow-hidden rounded-[28px] transition md:grid-cols-[190px_1fr_250px] ${
        highlighted
          ? "bg-[#4d6a51] ring-4 ring-[#63e86f] ring-offset-4 ring-offset-[#06160a]"
          : "bg-[#3a4f3d]"
      }`}
    >
      <div className="flex items-center justify-center p-7">
        <img
          src={image}
          alt={booking.movieTitle}
          className="h-[170px] w-[120px] rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-col justify-center px-7 pb-8 md:pr-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="w-fit rounded-full bg-[#58745a] px-4 py-1 text-[10px] font-black tracking-widest text-[#bfe6c0]">
            {status}
          </span>

          {highlighted && (
            <span className="rounded-full bg-[#63e86f] px-3 py-1 text-[10px] font-black tracking-[0.18em] text-[#06160a]">
              BOOKING #{booking.bookingId}
            </span>
          )}
        </div>

        <h3 className="mb-4 text-3xl font-black text-gray-100">
          {booking.movieTitle}
        </h3>

        <div className="space-y-2 text-sm font-semibold text-gray-300">
          <p>
            ▣ {formatThaiDate(booking.showDate)}
            <span className="ml-10">◷ {formatThaiTime(booking.startTime)}</span>
          </p>
          <p>◎ {cinema}</p>
          <p className="text-[#63e86f]">▣ {formatSeatLabel(booking)}</p>
          <p className="text-gray-400">
            Booking #{booking.bookingId} • {booking.totalPrice.toLocaleString()} THB
          </p>
        </div>

        {!active && (
          <div className="mt-6 pb-6">
            <div className="rounded-2xl bg-[#06160a] px-5 py-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">
                    {isReviewed ? "ให้คะแนนแล้ว" : "ให้คะแนน"}
                  </span>

                  <div
                    className="flex gap-1 text-2xl"
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        disabled={isReviewed || submitting}
                        onMouseEnter={() => {
                          if (!isReviewed) {
                            setHoveredRating(star);
                          }
                        }}
                        onClick={() => {
                          if (isReviewed) {
                            return;
                          }

                          setRating(star);
                          setComposerOpen(true);
                        }}
                        className={`transition ${
                          isReviewed || submitting
                            ? "cursor-default"
                            : "hover:scale-110"
                        } ${
                          star <= displayedRating ? "text-yellow-400" : "text-gray-500"
                        }`}
                        aria-label={`ให้คะแนน ${star} ดาว`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {isReviewed && (
                  <span className="rounded-full border border-[#2f4b35] bg-[#102014] px-3 py-1 text-xs font-bold text-[#9ce3a4]">
                    {existingReview?.reviewScore} / 5 ดาว
                  </span>
                )}
              </div>

              {!isReviewed && composerOpen && (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="เขียนความรู้สึกสั้น ๆ เกี่ยวกับภาพยนตร์เรื่องนี้ (ไม่บังคับ)"
                    className="w-full rounded-2xl border border-[#243327] bg-[#102014] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#63e86f]"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                      {rating > 0
                        ? `คะแนนที่เลือก: ${rating} ดาว`
                        : "กรุณาเลือกคะแนน 1-5 ดาว"}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setComposerOpen(false);
                          setComment("");
                          setRating(0);
                          setHoveredRating(0);
                          setSubmitError(null);
                        }}
                        disabled={submitting}
                        className="rounded-full border border-[#2f4b35] px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-gray-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitReview}
                        disabled={submitting || rating === 0}
                        className="rounded-full bg-[#63e86f] px-4 py-2 text-sm font-black text-[#06160a] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? "กำลังบันทึก..." : "ส่งคะแนน"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isReviewed && existingReview?.comment && (
                <p className="mt-4 rounded-2xl border border-[#243327] bg-[#102014] px-4 py-3 text-sm text-gray-300">
                  "{existingReview.comment}"
                </p>
              )}

              {submitError && (
                <p className="mt-3 text-sm font-medium text-red-300">
                  {submitError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative flex flex-col items-center justify-center border-t border-dashed border-[#243327] px-6 py-8 text-center md:border-t-0 md:border-l">
        <div className="absolute -top-3 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-[#06160a] md:left-[-13px] md:top-auto md:translate-x-0" />
        <div className="absolute -bottom-3 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-[#06160a] md:left-[-13px] md:translate-x-0" />

        {active ? (
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-[28px] bg-white text-4xl text-black">
              ▦
            </div>
            <p className="mt-4 text-xs font-semibold text-gray-300">
              สแกนเพื่อเข้าโรงภาพยนตร์
            </p>
          </div>
        ) : (
          <div className="text-center opacity-60">
            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-[28px] bg-gray-600 text-5xl">
              ✅
            </div>
            <p className="mt-4 text-xs font-semibold text-gray-300">
              เข้าชมแล้ว
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
