import Navbar from "../../../components/Navbar";
import Link from "next/link";

const voiceActors = [
  {
    name: "Junya Enoki",
    role: "พากย์เสียง",
    image: "/images/Junya%20Enoki.jpg",
  },
  {
    name: "Yuma Uchida",
    role: "พากย์เสียง",
    image: "/images/Yuma%20Uchida.webp",
  },
  {
    name: "Asami Seto",
    role: "พากย์เสียง",
    image: "/images/Asami%20Seto.webp",
  },
];

const directors = [
  {
    name: "Sunghoo Park",
    role: "Director",
    image: "/images/Sunghoo%20park.jpg",
  },
];

export default function MovieDetailPage() {
  return (
    <main className="movie-detail-page">
      <Navbar />

      <section className="movie-detail-container">
        <div className="movie-hero">
          <img
            src="/images/Jujutsu%20Kaisen%200.png.webp"
            alt="Jujutsu Kaisen 0"
            className="movie-hero-img"
          />

          <button className="play-button">▶</button>

          <div className="movie-hero-content">
            <span className="movie-tag">ANIME</span>
            <h1>Jujutsu Kaisen 0</h1>
          </div>
        </div>

        <div className="movie-meta-row">
          <span>⭐ 8.9</span>
          <span>2021</span>
          <span>105 นาที</span>
          <span>ญี่ปุ่น</span>
          <span className="green-text">Action / Animation</span>

          <Link href="/User/Booking" className="detail-book-btn">
            ดูรอบฉาย/จองตั๋ว
          </Link>
        </div>

        <section className="movie-section">
          <h2>เรื่องย่อ</h2>
          <p>
            เรื่องราวของ อคคตสึ ยูตะ เด็กหนุ่มที่ถูกคำสาประดับพิเศษจากวิญญาณของริกะ
            เพื่อนสมัยเด็กที่ตายไป ยูตะเข้าเรียนที่โรงเรียนไสยเวทภายใต้การดูแลของโกโจ
            ซาโตรุ เพื่อฝึกควบคุมพลังและแก้คำสาป โดยต้องเผชิญหน้ากับเกะโท สุรุ
            ที่หมายจะชิงพลังริกะ
          </p>
        </section>

        <section className="movie-section">
          <h2>นักพากย์</h2>

          <div className="people-row">
            {voiceActors.map((person) => (
              <div className="person-card" key={person.name}>
                <img src={person.image} alt={person.name} />
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="movie-section">
          <h2>ผู้กำกับ</h2>

          <div className="people-row staff-row">
            {directors.map((person) => (
              <div className="person-card" key={person.name}>
                <img src={person.image} alt={person.name} />
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}