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
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}