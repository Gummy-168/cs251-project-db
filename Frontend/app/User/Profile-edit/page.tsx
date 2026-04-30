"use client";

import { useRouter } from "next/navigation";


export default function ProfileEditPage() {

  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#1d2b22] text-white">
      <nav className="flex h-[60px] items-center bg-[#06160a] px-6">
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

      <section className="flex min-h-[calc(100vh-60px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-[620px] rounded-[36px] bg-[#3b4f3f] px-12 py-10 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full border-4 border-[#63e86f] bg-[#243327] text-6xl">
              👨🏻‍💼
            </div>

            <h2 className="mt-6 text-3xl font-bold">ข้อมูลส่วนตัว</h2>
            <p className="mt-1 text-sm text-gray-300">
              จัดการข้อมูลส่วนตัวและการติดต่อของคุณ
            </p>
          </div>

          <form className="mt-10 space-y-6">
            <div>
              <label className="mb-2 block text-sm text-gray-200">
                ชื่อที่แสดง
              </label>
              <input
                type="text"
                placeholder="กรอกชื่อของคุณ"
                className="h-[48px] w-full rounded-full bg-[#243327] px-5 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-200">
                วันเกิด
              </label>
              <input
                type="date"
                className="h-[48px] w-full rounded-full bg-[#243327] px-5 text-sm text-gray-400 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-200">
                เบอร์มือถือ
              </label>
              <input
                type="tel"
                placeholder="0xx-xxx-xxxx"
                className="h-[48px] w-full rounded-full bg-[#243327] px-5 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-200">
                อีเมล
              </label>
              <input
                type="email"
                placeholder="example@emerald.com"
                className="h-[48px] w-full rounded-full bg-[#243327] px-5 text-sm text-white outline-none placeholder:text-gray-500"
              />
            </div>

           <button
  type="button"
  onClick={() => {
    alert("บันทึกข้อมูลแล้ว");
    router.push("/User/Home");
  }}
  className="h-[54px] w-full rounded-full bg-[#50c463] text-base font-bold text-[#06160a] shadow-lg shadow-green-900/40 transition hover:bg-[#63e86f]"
>
  บันทึกข้อมูล
</button>
          </form>
        </div>
      </section>
    </main>
  );
}