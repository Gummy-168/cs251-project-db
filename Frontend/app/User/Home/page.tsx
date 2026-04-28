export default function HomePage() {
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
      image: "/image/jujutsu.jpg",
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
          <a href="/User/Ticket" className="transition hover:text-[#63e86f]">
            ตั๋วของฉัน
          </a>
        </div>

        <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#63e86f] text-sm text-[#63e86f]">
          ◎
        </div>
      </nav>

      <section className="grid w-full grid-cols-[minmax(0,1fr)_290px] gap-8 px-8 pb-12 pt-10">
        <div className="min-w-0">
          <section className="mb-14">
            <div className="mb-6 flex items-center justify-between">
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
                  className="overflow-hidden rounded-[24px] bg-[#273028]"
                >
                  <div className="relative h-[150px] w-full">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="h-full w-full object-cover object-center"
                    />

                    <span className="absolute right-4 top-4 rounded-full bg-yellow-400 px-4 py-1 text-xs font-black text-black">
                      {promo.tag}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-2 text-xl font-black">{promo.title}</h3>

                    <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-gray-300">
                      {promo.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-4xl font-black">หนังที่กำลังฉาย</h2>

              <a
                href="/User/Movies"
                className="text-base font-bold text-[#63e86f]"
              >
                ดูทั้งหมด
              </a>
            </div>

            <div className="grid grid-cols-4 gap-8">
              {movies.map((movie) => (
                <article key={movie.title} className="w-full">
                  <div className="mb-4 flex h-[420px] w-full items-center justify-center overflow-hidden rounded-[22px] bg-[#172319]">
                    <img
                      src={movie.image}
                      alt={movie.title}
                     className="h-full w-full object-contain object-center"
                    />
                  </div>

                  <h3 className="mb-4 text-base font-black">{movie.title}</h3>

                  <button className="w-full rounded-full bg-[#63e86f] py-4 text-sm font-black text-black transition hover:bg-[#4ebd5a]">
                    จองตั๋ว
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>

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
                    className="h-[62px] w-[46px] rounded-md object-cover object-center"
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
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}