"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBooking } from "@/services/api";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const showtimeId = searchParams.get("showtimeId");
  const seatIdsRaw = searchParams.get("seatIds") ?? "";
  const totalRaw =
    searchParams.get("totalPrice") ?? searchParams.get("total") ?? "";
  const movieId = searchParams.get("movieId");
  const [uid, setUid] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seatIds = useMemo(
    () =>
      seatIdsRaw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [seatIdsRaw]
  );

  const total = useMemo(() => {
    const parsed = Number(totalRaw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [totalRaw]);

  const parsedShowtimeId = useMemo(() => {
    const parsed = Number(showtimeId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [showtimeId]);

  const parsedSeats = useMemo(() => {
    return seatIds
      .map((seatId) => {
        const match = seatId.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);

        if (!match) {
          return null;
        }

        return {
          SeatRow: match[1],
          SeatNumber: Number(match[2]),
        };
      })
      .filter(
        (seat): seat is { SeatRow: string; SeatNumber: number } => seat !== null
      );
  }, [seatIds]);

  useEffect(() => {
    const rawUser = window.localStorage.getItem("emerald_user");

    if (!rawUser) {
      router.replace("/User/Signin");
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as { UID?: number };

      if (!parsedUser.UID) {
        window.localStorage.removeItem("emerald_user");
        router.replace("/User/Signin");
        return;
      }

      setUid(parsedUser.UID);
      setAuthChecked(true);
    } catch {
      window.localStorage.removeItem("emerald_user");
      router.replace("/User/Signin");
    }
  }, [router]);

  const canConfirmPayment =
    authChecked &&
    uid !== null &&
    parsedShowtimeId !== null &&
    seatIds.length > 0 &&
    parsedSeats.length === seatIds.length &&
    total > 0 &&
    !submitting;

  async function handleConfirmPayment() {
    if (!canConfirmPayment || parsedShowtimeId === null || uid === null) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const booking = await createBooking({
        ShowtimeID: parsedShowtimeId,
        UID: uid,
        Seats: parsedSeats,
      });

      alert("ชำระเงินสำเร็จและบันทึกการจองเรียบร้อยแล้ว");

      const params = new URLSearchParams({
        bookingId: String(booking.BookingID),
      });

      if (movieId) {
        params.set("movieId", movieId);
      }

      router.push(`/User/Ticket?${params.toString()}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ไม่สามารถบันทึกการจองได้ กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#06160a] text-white">
      {/* Navbar */}
      <nav className="flex h-[72px] w-full items-center px-8">
        <h1 className="mr-12 font-serif text-3xl text-[#63e86f]">
          Emerald Cinema
        </h1>

        <div className="flex gap-10 text-sm text-gray-200">
          <Link href="/User/Home" className="hover:text-[#63e86f]">
            หน้าหลัก
          </Link>
          <Link href="/User/Movies" className="hover:text-[#63e86f]">
            ภาพยนตร์
          </Link>
          <Link href="/User/Promotion" className="hover:text-[#63e86f]">
            โปรโมชั่น
          </Link>
          <Link href="/User/Ticket" className="hover:text-[#63e86f]">
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

      {/* Content */}
      <section className="flex justify-center items-center py-10">
        <div className="w-[420px] rounded-[32px] bg-[#273028] p-8 text-center shadow-xl">
          
          <h2 className="text-4xl font-black mb-6">ชำระเงิน</h2>

          {/* QR Card */}
          <div className="bg-[#f5f5f5] rounded-[24px] p-5">
            <div className="bg-[#1d2a44] p-5 flex justify-center items-center">
              <img
  src="/myqr.png"
  alt="QR Payment"
  className="w-[200px] h-[200px] object-contain bg-white p-2"
/>
            </div>

            <p className="text-black mt-4 text-sm font-bold">
              Thai QR Payment / PromptPay
            </p>

            <div className="flex justify-center gap-2 mt-2">
              <span className="text-black bg-white px-3 py-1 rounded-full border">
                K-Bank
              </span>
              <span className="text-black bg-white px-3 py-1 rounded-full border">
                SCB
              </span>
              <span className="text-black bg-white px-3 py-1 rounded-full border">
                PromptPay
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="mt-8">
            <p className="text-gray-400 text-sm">ยอดที่ต้องชำระ</p>
            <p className="text-4xl font-black text-[#63e86f] mt-1">
              {total.toLocaleString()} <span className="text-lg">THB</span>
            </p>
          </div>

          <p className="mt-6 text-gray-400 text-sm">
            กรุณาชำระเงินภายใน 09:59
          </p>

          {authChecked && parsedSeats.length !== seatIds.length && (
            <p className="mt-4 rounded-full bg-red-950/40 px-4 py-2 text-xs text-red-100">
              พบรูปแบบที่นั่งไม่ถูกต้อง กรุณาเลือกที่นั่งใหม่อีกครั้ง
            </p>
          )}

          {!canConfirmPayment && (
            <p className="mt-4 rounded-full bg-red-950/40 px-4 py-2 text-xs text-red-100">
              {authChecked
                ? "ข้อมูลการชำระเงินไม่ครบ กรุณาเลือกที่นั่งใหม่"
                : "กำลังตรวจสอบข้อมูลผู้ใช้งาน"}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-full bg-red-950/40 px-4 py-2 text-xs text-red-100">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="button"
            disabled={!canConfirmPayment}
            onClick={handleConfirmPayment}
            className={`mt-6 w-full rounded-full py-3 font-bold transition ${
              canConfirmPayment
                ? "bg-[#63e86f] text-black hover:bg-[#4ebd5a]"
                : "cursor-not-allowed bg-[#3f5742] text-[#b7c7b8]"
            }`}
          >
            {submitting ? "กำลังบันทึกการจอง..." : "เสร็จสิ้น"}
          </button>

          <div className="mt-6 text-xs bg-[#172319] inline-block px-4 py-2 rounded-full">
            Showtime #{showtimeId ?? "-"} • {seatIds.length > 0 ? seatIds.join(", ") : "-"}
          </div>
        </div>
      </section>
    </main>
  );
}
