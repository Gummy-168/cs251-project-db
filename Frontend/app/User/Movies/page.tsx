
export default function MoviesPage() {
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
      style={{
        padding: "10px 18px", // 🔥 ทำให้เล็กลง
        borderRadius: "999px",
        border: "none",
        backgroundColor: item === "ทั้งหมด" ? "#63e86f" : "#2c352e",
        color: item === "ทั้งหมด" ? "#06160a" : "#d7ddd7",
        fontSize: "14px", // เล็กลง
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
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

  <div className="flex flex-1 flex-col px-4 py-3">
  
  {/* Title */}
  <h3 className="line-clamp-2 min-h-[42px] text-center text-[14px] font-semibold leading-tight">
    {movie.title}
  </h3>

  {/* Info */}
  <div className="mt-2 flex justify-between text-[12px] text-gray-300">
    <span>{movie.genre}</span>
    <span>{movie.duration}</span>
  </div>

  {/* Button */}
  <button className="mt-auto h-[44px] w-full rounded-full bg-[#63e86f] text-[14px] font-semibold text-[#06160a] transition hover:opacity-90">
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