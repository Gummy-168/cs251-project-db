"use client";

import { useState } from "react";
export default function TicketPage() {

  return (
    <main className="min-h-screen bg-[#06160a] text-white">
      <nav className="flex h-[72px] w-full items-center bg-[#06160a] px-8">
  <h1 className="mr-12 font-serif text-3xl font-normal text-[#63e86f]">
    Emerald Cinema
  </h1>

  <div className="flex items-center gap-10 text-sm font-medium text-gray-200">
    <a href="/User/Home" className="transition hover:text-[#63e86f]">
      หน้าหลัก
    </a>

    <a href="/User/Movies" className="transition hover:text-[#63e86f]">
      ภาพยนตร์
    </a>

    <a
      href="/User/Promotion"
      className="transition hover:text-[#63e86f]"
    >
      โปรโมชั่น
    </a>

    <a href="/User/Ticket" className="text-[#63e86f]">
      ตั๋วของฉัน
    </a>
  </div>

  <a
    href="/User/Profile"
    className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#63e86f] text-sm text-[#63e86f] transition hover:bg-[#63e86f] hover:text-[#06160a]"
  >
    ◎
  </a>
</nav>

      <section className="mx-auto max-w-[1000px] px-6 py-12">
        <div className="mb-10">
          <h2 className="text-5xl font-black text-gray-100">ตั๋วของฉัน</h2>
          <p className="mt-2 text-lg font-semibold text-gray-400">
            พบประวัติการจองและตั๋วชมภาพยนตร์ของคุณที่นี่
          </p>
        </div>

        <div className="space-y-8">
          <TicketCard
            image="/image/jujutsu.jpg"
            status="NOW PLAYING"
            title="Jujutsu Kaisen 0"
            date="14 พฤษภาคม 2569"
            time="16:45 น."
            cinema="Rangsit - Theater 04"
            seat="Seat No. K6,K7"
            active
          />

          <TicketCard
            image="/image/gohan.webp"
            status="WATCHED"
            title="Gohan"
            date="02 พฤษภาคม 2569"
            time="14:15 น."
            cinema="Rangsit - Theater 01"
            seat="Seat No. B05"
          />
        </div>
      </section>
    </main>
  );
}

function TicketCard({
  image,
  status,
  title,
  date,
  time,
  cinema,
  seat,
  active = false,
}: {
  image: string;
  status: string;
  title: string;
  date: string;
  time: string;
  cinema: string;
  seat: string;
  active?: boolean;
}) {

  const [rating, setRating] = useState(0);

  return (
    <article className="relative grid h-[290px] grid-cols-[190px_1fr_250px] overflow-hidden rounded-[28px] bg-[#3a4f3d]">
      <div className="flex items-center justify-center p-7">
        <img
          src={image}
          alt={title}
          className="h-[170px] w-[120px] rounded-lg object-cover"
        />
      </div>

      <div className="flex flex-col justify-center py-8 pr-8">
        <span className="mb-4 w-fit rounded-full bg-[#58745a] px-4 py-1 text-[10px] font-black tracking-widest text-[#bfe6c0]">
          {status}
        </span>

        <h3 className="mb-4 text-3xl font-black text-gray-100">{title}</h3>

        <div className="space-y-2 text-sm font-semibold text-gray-300">
          <p>▣ {date} <span className="ml-10">◷ {time}</span></p>
          <p>◎ {cinema}</p>
          <p className="text-[#63e86f]">▣ {seat}</p>
        </div>

        {!active && (
          <div className="mt-6 flex justify-end pb-6">
  <div className="flex items-center gap-2 rounded-xl bg-[#06160a] px-5 py-3 shadow-lg">
    <span className="text-sm text-gray-400">ให้คะแนน</span>

    <div className="flex gap-1 text-2xl">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`transition hover:scale-110 ${
            star <= rating
              ? "text-yellow-400"
              : "text-gray-500"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  </div>
</div>
        )}
      </div>

      <div className="relative flex flex-col items-center justify-center border-l border-dashed border-[#243327] px-6 text-center">
        <div className="absolute -top-3 left-[-13px] h-7 w-7 rounded-full bg-[#06160a]" />
        <div className="absolute -bottom-3 left-[-13px] h-7 w-7 rounded-full bg-[#06160a]" />

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