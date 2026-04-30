"use client";

import { useState } from "react";

export default function MoviesPage() {
  const [activeCategory, setActiveCategory] = useState("ทั้งหมด");

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
          <a href="/User/Movies" className="text-[#63e86f]">
            ภาพยนตร์
          </a>
          <a href="/User/Promotion" className="transition hover:text-[#63e86f]">
            โปรโมชั่น
          </a>
          <a href="/User/Ticket" className="transition hover:text-[#63e86f]">
            ตั๋วของฉัน
          </a>
        </div>

        <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#63e86f] text-sm text-[#63e86f]">
          ◎
        </div>
      </nav>

      <section className="mx-auto max-w-[1200px] px-8 py-10">
        <div className="mb-10 flex items-center justify-between">
  <h2 className="text-4xl font-black">ภาพยนตร์ที่กำลังฉาย</h2>

  <div
  style={{
    display: "flex",
    gap: "16px", // ระยะห่างพอดี
    alignItems: "center",
    flexWrap: "wrap", // กันล้นจอ
  }}
>
  {["ทั้งหมด", "Action", "Anime", "Fantasy", "Horror", "Sports", "Drama"].map((item) => (
    <button
  key={item}
  onClick={() => setActiveCategory(item)}
  className={`rounded-full px-6 py-3 text-[14px] font-semibold transition duration-200
  ${
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
          {movies.map((movie) => (
            <article
  key={movie.title}
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
  <img
    src={movie.image}
    alt={movie.title}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
  />
</div>

  <div className="flex flex-1 flex-col px-4 py-4">

  <h3 className="line-clamp-2 min-h-[48px] text-center text-[15px] font-semibold leading-tight">
    {movie.title}
  </h3>

  <div className="flex flex-1 items-center">
    <div className="flex w-full justify-between text-[13px] text-gray-300">
      <span>{movie.genre}</span>
      <span>{movie.duration}</span>
    </div>
  </div>

  <button
  onClick={() => window.location.href = "/booking"}
  className="mt-4 h-[46px] w-full rounded-full bg-[#63e86f] text-[15px] font-semibold text-[#06160a]"
>
  จองตั๋ว
</button>

</div>
</article>
          ))}
        </div>
      </section>
    </main>
  );
}

const movies = [
  {
    title: "Jujutsu Kaisen 0",
    genre: "Anime",
    duration: "105 นาที",
    image: "/image/jujutsu.jpg",
  },
  {
    title: "Deadpool & Wolverine",
    genre: "Fantasy",
    duration: "152 นาที",
    image: "/image/deadpool.webp",
  },
  {
    title: "Blue Lock: Episode Nagi",
    genre: "Sports",
    duration: "95 นาที",
    image: "/image/bluelock.webp",
  },
  {
    title: "Detective Conan: Fall...",
    genre: "Action, Anime",
    duration: "100 นาที",
    image: "/image/conan.webp",
  },
  {
    title: "GOAT",
    genre: "Action, Adventure",
    duration: "100 นาที",
    image: "/image/goat.jpg",
  },
  {
    title: "Lee Cronin's The Mummy",
    genre: "Fantasy, Horror",
    duration: "133 นาที",
    image: "/image/themummy.webp",
  },
  {
    title: "The Convenience Store",
    genre: "Horror",
    duration: "99 นาที",
    image: "/image/theconveniencestore.jpg",
  },
  {
    title: "Gohan",
    genre: "Drama",
    duration: "141 นาที",
    image: "/image/gohan.webp",
  },
];