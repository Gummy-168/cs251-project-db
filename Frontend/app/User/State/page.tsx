"use client";

import { useState } from "react";

type SeatStatus = "standard" | "premium" | "selected" | "unavailable";

type Seat = {
  id: string;
  row: string;
  status: SeatStatus;
};

const seats: Seat[] = [
  { id: "A1", row: "A", status: "unavailable" },
  { id: "A2", row: "A", status: "unavailable" },
  { id: "A3", row: "A", status: "unavailable" },
  { id: "A4", row: "A", status: "unavailable" },
  { id: "A5", row: "A", status: "unavailable" },
  { id: "A6", row: "A", status: "unavailable" },
  { id: "A7", row: "A", status: "unavailable" },
  { id: "A8", row: "A", status: "unavailable" },

  { id: "B1", row: "B", status: "unavailable" },
  { id: "B2", row: "B", status: "unavailable" },
  { id: "B3", row: "B", status: "unavailable" },
  { id: "B4", row: "B", status: "unavailable" },
  { id: "B5", row: "B", status: "unavailable" },
  { id: "B6", row: "B", status: "unavailable" },
  { id: "B7", row: "B", status: "unavailable" },
  { id: "B8", row: "B", status: "unavailable" },

  { id: "K1", row: "K", status: "premium" },
  { id: "K2", row: "K", status: "premium" },
  { id: "K3", row: "K", status: "premium" },
  { id: "K4", row: "K", status: "premium" },
  { id: "K5", row: "K", status: "premium" },
  { id: "K6", row: "K", status: "selected" },
  { id: "K7", row: "K", status: "selected" },
  { id: "K8", row: "K", status: "premium" },

  { id: "L1", row: "L", status: "unavailable" },
  { id: "L2", row: "L", status: "premium" },
  { id: "L3", row: "L", status: "unavailable" },
  { id: "L4", row: "L", status: "premium" },
  { id: "L5", row: "L", status: "premium" },
  { id: "L6", row: "L", status: "premium" },
  { id: "L7", row: "L", status: "premium" },
  { id: "L8", row: "L", status: "premium" },
];

const rows = ["A", "B", "K", "L"];

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5.5 18.5C6.7 15.9 9 14.5 12 14.5C15 14.5 17.3 15.9 18.5 18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function SeatIcon({
  status,
  small = false,
}: {
  status: SeatStatus;
  small?: boolean;
}) {
  const color =
    status === "selected"
      ? "text-[#6FDE76]"
      : status === "premium"
      ? "text-[#FFD34E]"
      : "text-[#D4E9D2]";

  const iconSize = small ? 24 : 40;
  const boxClass = small ? "h-8 w-8" : "h-14 w-14";

  return (
    <button
      type="button"
      disabled={status === "unavailable"}
      className={`flex ${boxClass} items-center justify-center ${color}`}
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
        {status === "unavailable" ? (
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

export default function BookingPage() {
  const [code, setCode] = useState("");

  const selectedSeats = seats.filter((seat) => seat.status === "selected");
  const total = selectedSeats.length * 250;

  return (
    <main className="min-h-screen w-full bg-[#061008] text-[#D4E9D2]">
      <div className="mx-auto w-full px-8 pb-8 pt-1">
        <nav className="flex h-[78px] items-center justify-between">
          <div className="flex items-center gap-12">
            <a
              href="/User/Home"
              className="font-serif text-[34px] uppercase tracking-wide text-[#6FDE76]"
            >
              Emerald Cinema
            </a>

            <div className="flex items-center gap-10 text-[16px] font-medium text-[#D4E9D2]">
              <a href="/User/Home" className="transition hover:text-[#6FDE76]">
                หน้าหลัก
              </a>
              <a href="/User/Movies" className="transition hover:text-[#6FDE76]">
                ภาพยนตร์
              </a>
              <a
                href="/User/Promotion"
                className="transition hover:text-[#6FDE76]"
              >
                โปรโมชั่น
              </a>
              <a href="/User/Ticket" className="transition hover:text-[#6FDE76]">
                ตั๋วของฉัน
              </a>
            </div>
          </div>

          <a
            href="/User/Profile"
            className="text-[#6FDE76] transition hover:scale-105"
          >
            ◎
          </a>
        </nav>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="relative min-h-[760px] rounded-[38px] bg-[#0E1C12] px-14 pt-16 pb-10 shadow-[inset_0_0_50px_rgba(78,189,90,0.05)]">
            <div className="mx-auto mt-4 h-[8px] w-[78%] rounded-full bg-[#4EBD5A]/80 shadow-[0_0_28px_rgba(78,189,90,0.45)]" />

            <p className="mt-5 text-center text-[16px] font-semibold text-[#D4E9D2]">
              หน้าจอ
            </p>

            <div className="mx-auto mt-24 w-fit space-y-7">
              {rows.map((row) => {
                const rowSeats = seats.filter((seat) => seat.row === row);

                return (
                  <div
                    key={row}
                    className="grid grid-cols-[30px_repeat(4,56px)_86px_repeat(4,56px)_30px] items-center gap-5"
                  >
                    <span className="text-[17px] font-semibold text-[#D4E9D2]">
                      {row}
                    </span>

                    {rowSeats.slice(0, 4).map((seat) => (
                      <SeatIcon key={seat.id} status={seat.status} />
                    ))}

                    <div />

                    {rowSeats.slice(4, 8).map((seat) => (
                      <SeatIcon key={seat.id} status={seat.status} />
                    ))}

                    <span className="text-[17px] font-semibold text-[#D4E9D2]">
                      {row}
                    </span>
                  </div>
                );
              })}
            </div>

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
                <SeatIcon status="selected" small />
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
                src="/image/jujutsu.jpg"
                alt="Jujutsu Kaisen"
                className="h-[140px] w-[96px] rounded-[28px] object-cover"
              />

              <div>
                <h3 className="text-[20px] font-semibold text-white">
                  Jujutsu Kaisen
                </h3>

                <div className="mt-3 space-y-2 text-[14px] text-[#D4E9D2]">
                  <p>☆ EN/TH</p>
                  <div className="flex items-center gap-2">
                    <ClockIcon />
                    <span>105 นาที</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] bg-[#3B463B] px-6 py-5">
              <div className="flex items-center gap-3 text-[#6FDE76]">
                <LocationIcon />
                <span className="text-[15px] font-semibold text-[#D4E9D2]">
                  Emerald Cineplex Rangsit
                </span>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.15em] text-[#D4E9D2]/65">
                    Date & Time
                  </p>
                </div>
                <p className="text-[16px] font-bold text-white">วันนี้ 16:45</p>
              </div>
            </div>

            <div className="mt-8 space-y-7">
              <div className="flex items-center justify-between">
                <span className="text-[15px] text-[#D4E9D2]/80">
                  ที่นั่งที่เลือก
                </span>
                <span className="text-[16px] font-bold text-[#6FDE76]">
                  {selectedSeats.map((seat) => seat.id).join(", ")}
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
  onClick={() => window.location.href = "/User/Payment"}
  className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-[#6FDE76] py-5 text-[18px] font-bold text-[#061008] shadow-[0_12px_30px_rgba(111,222,118,0.35)] transition hover:bg-[#5ad764]"
>
  <span>ซื้อตั๋ว</span>
  <TicketIcon />
</button>
          </aside>
        </div>
      </div>
    </main>
  );
}