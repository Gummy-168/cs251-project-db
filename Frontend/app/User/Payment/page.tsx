"use client";

import { useRouter } from "next/navigation";
export default function PaymentPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen w-full bg-[#06160a] text-white">
      {/* Navbar */}
      <nav className="flex h-[72px] w-full items-center px-8">
        <h1 className="mr-12 font-serif text-3xl text-[#63e86f]">
          Emerald Cinema
        </h1>

        <div className="flex gap-10 text-sm text-gray-200">
          <a href="/User/Home" className="hover:text-[#63e86f]">
            หน้าหลัก
          </a>
          <a href="#" className="hover:text-[#63e86f]">
            ภาพยนตร์
          </a>
          <a href="#" className="hover:text-[#63e86f]">
            โปรโมชั่น
          </a>
          <a href="#" className="hover:text-[#63e86f]">
            ตั๋วของฉัน
          </a>
        </div>

        <a
  href="/User/Profile"
  className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#63e86f] text-sm text-[#63e86f] transition hover:bg-[#63e86f] hover:text-[#06160a]"
>
  ◎
</a>
      </nav>

      {/* Content */}
      <section className="flex justify-center items-center py-10">
        <div className="w-[420px] rounded-[32px] bg-[#273028] p-8 text-center shadow-xl">
          
          <h2 className="text-4xl font-black mb-6">ชำระเงิน</h2>

          {/* QR Card */}
          <div className="bg-[#f5f5f5] rounded-[24px] p-5">
            <div className="bg-[#1d2a44] p-5 flex justify-center items-center">
              <img
  src="/myqr.png"
  alt="QR Payment"
  className="w-[200px] h-[200px] object-contain bg-white p-2"
/>
            </div>

            <p className="text-black mt-4 text-sm font-bold">
              Thai QR Payment / PromptPay
            </p>

            <div className="flex justify-center gap-2 mt-2">
              <span className="text-black bg-white px-3 py-1 rounded-full border">
                K-Bank
              </span>
              <span className="text-black bg-white px-3 py-1 rounded-full border">
                SCB
              </span>
              <span className="text-black bg-white px-3 py-1 rounded-full border">
                PromptPay
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="mt-8">
            <p className="text-gray-400 text-sm">ยอดที่ต้องชำระ</p>
            <p className="text-4xl font-black text-[#63e86f] mt-1">
              500 <span className="text-lg">THB</span>
            </p>
          </div>

          <p className="mt-6 text-gray-400 text-sm">
            กรุณาชำระเงินภายใน 09:59
          </p>

          {/* Button */}
          <button
  type="button"
  onClick={() => {
    alert("ระบบตรวจสอบการชำระเงินเรียบร้อยแล้ว");
    window.location.href = "/User/Home";
  }}
  className="mt-6 w-full rounded-full bg-[#63e86f] py-3 font-bold text-black transition hover:bg-[#4ebd5a]"
>
  เสร็จสิ้น
</button>

          <div className="mt-6 text-xs bg-[#172319] inline-block px-4 py-2 rounded-full">
            A6, K7
          </div>
        </div>
      </section>
    </main>
  );
}