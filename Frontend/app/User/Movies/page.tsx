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

      <section className="px-14 py-10">
  <div className="mb-8 flex items-center justify-between">
    <h2 className="text-4xl font-black">ภาพยนตร์ที่กำลังฉาย</h2>

    <div className="flex gap-3">
      {["ทั้งหมด", "Action", "Anime", "Fantasy", "Sci-Fi"].map((item) => (
        <button
          key={item}
          className={`rounded-full px-6 py-2 text-xs font-black ${
            item === "ทั้งหมด"
              ? "bg-[#63e86f] text-black"
              : "bg-[#273028] text-white"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  </div>

  <div className="grid grid-cols-4 gap-x-12 gap-y-12">
    {movies.map((movie, index) => (
      <article key={`${movie.title}-${index}`} className="min-w-0">
        <div className="aspect-[2/3] overflow-hidden rounded-[14px] bg-[#172319]">
          <img
            src={movie.image}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="mt-4 text-lg font-black leading-snug text-white">
          {movie.title}
        </h3>

        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600">
            {movie.genre}
          </span>
          <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600">
            {movie.duration}
          </span>
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
    title: "Detective Conan: Fallen Angel of the Highway",
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