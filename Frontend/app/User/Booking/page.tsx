import Image from "next/image";
import { MapPin, Search, Star } from "lucide-react";

const dates = [
  { label: "วันนี้", date: "14", active: true },
  { label: "ศ.", date: "15", active: false },
  { label: "ส.", date: "16", active: false },
  { label: "อา.", date: "17", active: false },
  { label: "จ.", date: "18", active: false },
  { label: "อ.", date: "19", active: false },
];

const cinemas = [
  {
    name: "Rangsit",
    address: "4th Floor, Rangsit",
    tag: "4DX",
    times: ["11:30", "14:15", "16:45", "19:45", "22:30"],
  },
  {
    name: "The Forest Gallery EmQuartier",
    address: "6th Floor, The Helix Quartier, Bangkok",
    tag: "IMAX Laser",
    times: ["10:00", "13:30", "16:45", "20:45"],
  },
  {
    name: "Eco-Cine Siam Discovery",
    address: "4th Floor, Siam Discovery, Bangkok",
    tag: "",
    times: ["12:00", "15:30", "18:45"],
  },
];

export default function BookingPage() {
  return (
    <main className="min-h-screen w-full bg-[#071008] text-[#d4e9d2]">
      {/* Navbar */}
      <header className="flex h-[88px] w-full items-center justify-start gap-16 px-8">
        <h1 className="font-serif text-[30px] font-normal tracking-wide text-[#D4F9D2]">
          EMERALD CINEMA
        </h1>

        <nav className="flex items-center gap-12 text-[16px] font-normal text-[#F1F7EF]">
          <a href="#" className="transition hover:text-[#4EBD5A]">
            หน้าหลัก
          </a>
          <a href="#" className="transition hover:text-[#4EBD5A]">
            ภาพยนตร์
          </a>
          <a href="#" className="transition hover:text-[#4EBD5A]">
            โปรโมชั่น
          </a>
          <a href="#" className="transition hover:text-[#4EBD5A]">
            ตั๋วของฉัน
          </a>
        </nav>
      </header>

      <section className="w-full px-8 pb-14 pt-5 xl:px-12">
        {/* Movie Detail */}
        <div className="mb-12 grid w-full grid-cols-[280px_1fr] gap-8 xl:grid-cols-[300px_1fr] xl:gap-10">
          <div>
            <Image
              src="/image/jujutsu.jpg"
              alt="Jujutsu Kaisen 0"
              width={250}
              height={380}
              priority
              className="h-[380px] w-[250px] rounded-[22px] object-cover shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
            />
          </div>

          <div className="flex max-w-[900px] flex-col justify-center">
            <p className="mb-3 text-[14px] font-medium text-[#d4e9d2]/75">
              105 นาที <span className="mx-1">•</span> Action/Animation
            </p>

            <h2 className="mb-5 text-[58px] font-extrabold leading-none tracking-[-0.04em] text-[#eef8eb]">
              Jujutsu Kaisen 0
            </h2>

            <p className="mb-6 max-w-[850px] text-[15px] leading-7 text-[#d4e9d2]/80">
              เล่าเรื่องของ อคคทสึ ยูตะ เด็กหนุ่มที่ถูกคำสาประดับพิเศษจากวิญญาณของริกะ
              เพื่อนสมัยเด็กที่ตายไป ยูตะเข้าเรียนที่โรงเรียนไสยเวทภายใต้การดูแลของโกโจ
              ซาโตรุ เพื่อฝึกควบคุมพลังและแก้คำสาป โดยต้องเผชิญหน้ากับเกะโท
              สุรุ ที่หมายจะชิงพลังริกะ
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-[#273028] px-4 py-2 text-[13px] font-bold text-[#eef8eb]">
                <Star className="h-4 w-4 fill-[#f5c54b] text-[#f5c54b]" />
                8.9 / 10
              </div>

              <div className="flex items-center gap-2 rounded-full bg-[#214824] px-4 py-2 text-[13px] font-bold text-[#eef8eb]">
                <span className="h-3 w-3 rounded-sm bg-[#4EBD5A]" />
                IMAX
              </div>
            </div>
          </div>
        </div>

        {/* Date Select */}
        <div className="mb-7">
          <h3 className="mb-5 text-[24px] font-extrabold text-[#4EBD5A]">
            เลือกเวลาฉาย
          </h3>

          <div className="flex flex-wrap gap-4">
            {dates.map((item) => (
              <button
                key={item.date}
                className={`flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full transition ${
                  item.active
                    ? "bg-[#58D96B] text-[#071008] shadow-[0_0_28px_rgba(88,217,107,0.42)]"
                    : "bg-[#273028] text-[#d4e9d2] hover:bg-[#354338]"
                }`}
              >
                <span className="mb-1 text-[11px] font-semibold">
                  {item.label}
                </span>
                <span className="text-[25px] font-black leading-none">
                  {item.date}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 flex h-[48px] w-full max-w-[720px] items-center gap-3 rounded-full border border-[#2f6b34] bg-[#101c13] px-5">
          <Search className="h-5 w-5 text-[#4EBD5A]" />
          <input
            type="text"
            placeholder="ค้นหา"
            className="w-full bg-transparent text-[13px] text-[#d4e9d2] outline-none placeholder:text-[#d4e9d2]/40"
          />
        </div>

        {/* Cinema Cards */}
        <div className="w-full space-y-6">
          {cinemas.map((cinema) => (
            <div
              key={cinema.name}
              className="w-full rounded-[36px] bg-[#232C24] px-7 py-6"
            >
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-[25px] font-extrabold leading-none text-[#eef8eb]">
                    {cinema.name}
                  </h4>

                  <div className="mt-2 flex items-center gap-1 text-[13px] text-white">
                    <MapPin className="h-4 w-4" />
                    <span>{cinema.address}</span>
                  </div>
                </div>

                {cinema.tag ? (
                  <span className="rounded-md bg-[#536653] px-8 py-2 text-[12px] font-bold text-[#58D96B]">
                    {cinema.tag}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-4">
                {cinema.times.map((time, index) => (
                  <button
                    key={time}
                    className={`flex h-[70px] w-[185px] flex-col items-center justify-center rounded-full transition ${
                      index < 2
                        ? "bg-[#202622] text-[#eef8eb]"
                        : "bg-[#536653] text-[#eef8eb]"
                    }`}
                  >
                    <span className="text-[20px] font-extrabold leading-none">
                      {time}
                    </span>
                    <span className="mt-2 text-[11px] font-semibold opacity-90">
                      EN / TH
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}