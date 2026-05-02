export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#06160a] text-white">
      <nav className="flex h-[60px] items-center px-6">
        <h1 className="mr-16 font-serif text-2xl text-[#63e86f]">
          Emerald Cinema
        </h1>

        <div className="flex gap-10 text-xs text-gray-200">
          <a href="/User/Home" className="hover:text-[#63e86f]">หน้าหลัก</a>
          <a href="/User/Movies" className="hover:text-[#63e86f]">ภาพยนตร์</a>
          <a href="/User/Promotion" className="hover:text-[#63e86f]">โปรโมชั่น</a>
          <a href="/User/Ticket" className="hover:text-[#63e86f]">ตั๋วของฉัน</a>
        </div>

        <a href="/User/Profile" className="ml-auto text-[#63e86f]">
          ◎
        </a>
      </nav>

      <section className="flex min-h-[calc(100vh-60px)] items-center justify-center px-4">
        <div className="w-full max-w-[620px] overflow-hidden rounded-[36px] bg-[#2b382d] shadow-2xl">
          <div className="h-[3px] bg-[#63e86f]" />

          <div className="px-12 py-10">
            <div className="flex flex-col items-center">
              <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full border-4 border-[#1d6f4b] bg-[#244433] text-6xl">
                👨🏻‍💼
              </div>

              <span className="-mt-3 rounded-full bg-[#63e86f] px-5 py-1 text-xs font-bold text-[#06160a]">
                สมาชิก
              </span>

              <h2 className="mt-6 text-3xl font-bold text-gray-100">
                Johnathan Evergreen
              </h2>
            </div>

            <div className="mt-12 space-y-0 text-sm">
              <div className="flex justify-between border-b border-[#172319] py-4">
                <span className="text-gray-400">ชื่อ</span>
                <span className="font-semibold">lovemovie123</span>
              </div>

              <div className="flex justify-between border-b border-[#172319] py-4">
                <span className="text-gray-400">วันเกิด</span>
                <span className="font-semibold">25 พฤษภาคม 2538</span>
              </div>

              <div className="flex justify-between border-b border-[#172319] py-4">
                <span className="text-gray-400">เบอร์โทรศัพท์</span>
                <span className="font-semibold">081-234-5678</span>
              </div>

              <div className="flex justify-between border-b border-[#172319] py-4">
                <span className="text-gray-400">อีเมล</span>
                <span className="font-semibold">user@example.com</span>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
  <a
    href="/User/Profile-edit"
    className="inline-block rounded-full border border-[#63e86f] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#63e86f] hover:text-[#06160a]"
  >
    ✎ แก้ไขโปรไฟล์
  </a>
</div>
          </div>

          <div className="grid grid-cols-2 bg-[#223025] py-6 text-center">
            <div>
              <p className="text-xl font-bold text-[#63e86f]">5</p>
              <p className="text-xs text-gray-400">ภาพยนตร์ที่ดูแล้ว</p>
            </div>

            <div>
              <p className="text-xl font-bold text-yellow-400">1</p>
              <p className="text-xs text-gray-400">ตั๋วใช้งาน</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}