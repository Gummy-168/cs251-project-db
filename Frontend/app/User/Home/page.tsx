<<<<<<< Updated upstream
import Navbar from "../../../components/Navbar";
import MovieCard from "../../../components/MovieCard";

const promotions = [
  {
    title: "Movie Night Combo",
    desc: "ลด 50% สำหรับชุดป๊อปคอร์นและเครื่องดื่ม 2 ที่นั่งขึ้นไป",
    image: "/images/Movie%20Night%20Combo.png",
  },
  {
    title: "Emerald Member Card",
    desc: "สมัครสมาชิกวันนี้ รับสิทธิ์ชมภาพยนตร์ฟรี 1 เรื่องทันที",
    image: "/images/Emerald%20Member%20Card.png",
  },
  {
    title: "Early Bird Ticket",
    desc: "จองล่วงหน้า รับส่วนลดพิเศษสำหรับรอบเช้า",
    image: "/images/Early%20Bird%20Tickets.png",
  },
];

const movies = [
  {
    title: "Jujutsu Kaisen 0",
    image: "/images/jujutsu.jpg",
  },
  {
    title: "F1 The Movie",
    image: "/images/f1.jpg",
  },
  {
    title: "LEGO The Second Part",
    image: "/images/lego.jpg",
  },
  {
    title: "The Super Mario Galaxy",
    image: "/images/mario.jpg",
  },
];

const topMovies = [
  {
    rank: 1,
    title: "Jujutsu Kaisen 0",
    image: "/images/jujutsu.jpg",
  },
  {
    rank: 2,
    title: "Old Town Stories",
    image: "/images/Old%20Town%20Stories.png",
  },
  {
    rank: 3,
    title: "Whispers in the Woods",
    image: "/images/Whispers%20in%20the%20Woods.png",
  },
  {
    rank: 4,
    title: "Beyond the Lens",
    image: "/images/Beyond%20the%20Lens.png",
  },
  {
    rank: 5,
    title: "Summer Blockbuster",
    image: "/images/Summer%20Blockbuster.png",
  },
];

const categories = [
  "All",
  "Action",
  "Horror",
  "Sci-Fi",
  "Drama",
  "Fantasy",
  "Adventure",
  "Comedy",
];

export default function HomePage() {
  return (
    <main className="home-page">
      <Navbar />

      <section className="home-layout">
        <div className="home-main">
          <div className="section-title-row">
            <h1>โปรโมชั่นพิเศษ</h1>
            <button className="see-all-btn">ดูทั้งหมด</button>
          </div>

          <div className="promotion-row">
            {promotions.map((promo) => (
              <div className="promotion-card" key={promo.title}>
                <div className="promotion-image-box">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="promotion-image"
                  />
                </div>

                <span className="hot-badge">HOT</span>

                <div className="promotion-content">
                  <h3>{promo.title}</h3>
                  <p>{promo.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="section-title-row movie-title-row">
            <h2>หนังที่กำลังฉาย</h2>
            <button className="see-all-btn">ดูทั้งหมด</button>
          </div>

          <div className="movie-grid-home">
            {movies.map((movie) => (
              <MovieCard
                key={movie.title}
                title={movie.title}
                image={movie.image}
                buttonText="จองตั๋ว"
              />
            ))}
          </div>
        </div>

        <aside className="home-sidebar">
          <div className="sidebar-card">
            <h2>Top 5 หนังฮิต</h2>

            <div className="top-list">
              {topMovies.map((movie) => (
                <div className="top-item" key={movie.rank}>
                  <span className="top-rank">{movie.rank}</span>

                  <div className="top-poster-box">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="top-poster"
                    />
                  </div>

                  <p>{movie.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card category-card">
            <h2>หมวดหมู่</h2>

            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    category === "All" ? "category-btn active" : "category-btn"
                  }
=======
export default function BookingPage() {
  const promotions = [
    {
      title: "Movie Night Combo",
      desc: "ลด 50% สำหรับชุดป๊อปคอร์นและเครื่องดื่ม 2 ที่นั่งขึ้นไป",
      image: "/image/Movie Night Combo.png",
      tag: "HOT",
    },
    {
      title: "Emerald Member Card",
      desc: "สมัครสมาชิกวันนี้ รับสิทธิพิเศษทุกครั้งที่ 1 เรื่องขึ้นไป",
      image: "/image/Emerald Member Card.png",
      tag: "HOT",
    },
    {
      title: "Early Bird Ticket",
      desc: "จองล่วงหน้า รับส่วนลดพิเศษสำหรับรอบเช้า",
      image: "/image/Early Bird Tickets.png",
      tag: "HOT",
    },
  ];

  const movies = [
    {
      title: "Jujutsu Kaisen 0",
      image: "/image/jujutsu.jpg",
    },
    {
      title: "F1 The Movie",
      image: "/image/f1.jpg",
    },
    {
      title: "LEGO The Second Part",
      image: "/image/lego.jpg",
    },
    {
      title: "The Super Mario Galaxy",
      image: "/image/mario.jpg",
    },
  ];

  const topMovies = [
    {
      title: "Jujutsu Kaisen 0",
      image: "/image/Jujutsu Kaisen 0.png",
    },
    {
      title: "Old Town Stories",
      image: "/image/Old Town Stories.png",
    },
    {
      title: "Whispers in the Woods",
      image: "/image/Whispers in the Woods.png",
    },
    {
      title: "Beyond the Lens",
      image: "/image/Beyond the Lens.png",
    },
    {
      title: "Summer Blockbuster",
      image: "/image/Summer Blockbuster.png",
    },
  ];

  const categories = [
    "All",
    "Action",
    "Horror",
    "Sci-Fi",
    "Drama",
    "Fantasy",
    "Adventure",
    "Comedy",
  ];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#06160a] text-white">
      {/* Navbar */}
      <nav className="flex h-[74px] w-full items-center justify-between bg-[#06160a] px-8">
        <h1 className="font-serif text-3xl font-bold uppercase text-[#63e86f]">
          Emerald Cinema
        </h1>

        <div className="flex items-center gap-14 text-sm font-bold">
          <a href="/User/Home" className="hover:text-[#63e86f]">
            หน้าหลัก
          </a>
          <a href="/User/Movies" className="hover:text-[#63e86f]">
            ภาพยนตร์
          </a>
          <a href="/User/Promotion" className="hover:text-[#63e86f]">
            โปรโมชั่น
          </a>
          <a href="/User/Ticket" className="hover:text-[#63e86f]">
            ตั๋วของฉัน
          </a>
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#63e86f] text-[#63e86f]">
          ◎
        </div>
      </nav>

      <section className="grid w-full grid-cols-[minmax(0,1fr)_290px] gap-8 px-8 pb-16 pt-12">
        {/* Left Content */}
        <div className="min-w-0">
          {/* Promotions */}
          <section className="mb-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-4xl font-black">โปรโมชั่นพิเศษ</h2>

              <a
                href="/User/Promotion"
                className="text-base font-bold text-[#63e86f]"
              >
                ดูทั้งหมด
              </a>
            </div>

            <div className="grid grid-cols-3 gap-7">
              {promotions.map((promo) => (
                <article
                  key={promo.title}
                  className="overflow-hidden rounded-[26px] bg-[#273028]"
                >
                  <div className="relative h-[175px] w-full">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="h-full w-full object-cover object-center"
                    />

                    <span className="absolute right-5 top-5 rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-black text-black">
                      {promo.tag}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-black">{promo.title}</h3>

                    <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-gray-300">
                      {promo.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Movies */}
          <section>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-4xl font-black">หนังที่กำลังฉาย</h2>

              <a
                href="/User/Movies"
                className="text-base font-bold text-[#63e86f]"
              >
                ดูทั้งหมด
              </a>
            </div>

            <div className="grid grid-cols-4 gap-7">
              {movies.map((movie) => (
                <article key={movie.title}>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="mb-4 h-[360px] w-full rounded-2xl bg-[#172319] object-contain object-center"
                  />

                  <h3 className="mb-4 text-base font-black">{movie.title}</h3>

                  <button className="w-full rounded-full bg-[#63e86f] py-4 text-sm font-black text-black transition hover:bg-[#4ebd5a]">
                    จองตั๋ว
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-7">
          <section className="rounded-[28px] bg-[#172319] p-7">
            <h3 className="mb-7 text-2xl font-black">Top 5 หนังฮิต</h3>

            <div className="space-y-5">
              {topMovies.map((movie, index) => (
                <div key={movie.title} className="flex items-center gap-4">
                  <div className="w-9 text-4xl font-black text-yellow-400">
                    {index + 1}
                  </div>

                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="h-[62px] w-[46px] rounded-md object-cover"
                  />

                  <p className="text-sm font-black leading-tight">
                    {movie.title}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] bg-[#172319] p-7">
            <h3 className="mb-7 text-2xl font-black">หมวดหมู่</h3>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
                    category === "All"
                      ? "bg-[#63e86f] text-black"
                      : "bg-[#273028] text-white hover:bg-[#4ebd5a] hover:text-black"
                  }`}
>>>>>>> Stashed changes
                >
                  {category}
                </button>
              ))}
            </div>
<<<<<<< Updated upstream
          </div>
=======
          </section>
>>>>>>> Stashed changes
        </aside>
      </section>
    </main>
  );
}