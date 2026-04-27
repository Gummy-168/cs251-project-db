import Navbar from "../../../components/Navbar";
import Link from "next/link";

const dates = [
  { day: "วันนี้", date: "14", active: true },
  { day: "ศ.", date: "15" },
  { day: "ส.", date: "16" },
  { day: "อา.", date: "17" },
  { day: "จ.", date: "18" },
  { day: "อ.", date: "19" },
];

const cinemas = [
  {
    name: "Rangsit",
    location: "4th Floor, Rangsit",
    tag: "4DX",
    times: ["11:30", "14:15", "16:45", "19:45", "22:30"],
  },
  {
    name: "The Forest Gallery EmQuartier",
    location: "6th Floor, The Helix Quartier, Bangkok",
    tag: "IMAX Laser",
    times: ["10:00", "13:30", "16:45", "20:45"],
  },
  {
    name: "Eco-Cine Siam Discovery",
    location: "4th Floor, Siam Discovery, Bangkok",
    tag: "",
    times: ["12:00", "15:30", "18:45"],
  },
];

export default function BookingPage() {
  return (
    <main className="booking-page">
      <Navbar />

      <section className="booking-content">
        <div className="booking-movie-info">
          <div className="booking-poster-box">
            <img
              src="/images/jujutsu.jpg"
              alt="Jujutsu Kaisen 0"
              className="booking-poster"
            />
          </div>

          <div className="booking-detail">
            <p className="booking-movie-meta">105 นาที • Action/Animation</p>

            <h1>Jujutsu Kaisen 0</h1>

            <p className="booking-description">
              เล่าเรื่องของ อคคตสึ ยูตะ เด็กหนุ่มที่ถูกคำสาประดับพิเศษจากวิญญาณของริกะ
              เพื่อนสมัยเด็กที่ตายไป ยูตะเข้าเรียนที่โรงเรียนไสยเวทเพื่อฝึกควบคุมพลัง
            </p>

            <div className="booking-rating-row">
              <span className="rating-pill">⭐ 8.9 / 10</span>
              <span className="imax-pill">▣ IMAX</span>
            </div>
          </div>
        </div>

        <div className="date-section">
          <h2>เลือกเวลาฉาย</h2>

          <div className="date-row">
            {dates.map((item) => (
              <button
                key={item.date}
                className={item.active ? "date-circle active" : "date-circle"}
              >
                <span>{item.day}</span>
                <strong>{item.date}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="cinema-search">
          <span>⌕</span>
          <input type="text" placeholder="ค้นหา" />
        </div>

        <div className="cinema-list">
          {cinemas.map((cinema) => (
            <div className="cinema-card" key={cinema.name}>
              <div className="cinema-card-header">
                <div>
                  <h3>{cinema.name}</h3>
                  <p>⌖ {cinema.location}</p>
                </div>

                {cinema.tag && <span className="cinema-tag">{cinema.tag}</span>}
              </div>

              <div className="showtime-row">
                {cinema.times.map((time, index) => (
                  <Link
                    key={time}
                    href="/User/Seat"
                    className={index < 2 ? "showtime-btn dark" : "showtime-btn"}
                  >
                    <strong>{time}</strong>
                    <span>EN / TH</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}