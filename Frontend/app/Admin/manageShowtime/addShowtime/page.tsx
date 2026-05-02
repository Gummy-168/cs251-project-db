'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clapperboard, Save } from 'lucide-react';

export default function AddShowtimePage() {
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get('date');

  return (
    <div className="relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_bottom,_rgba(61,88,64,0.34),_rgba(25,39,28,1)_54%)] text-gray-100">
      <div className="mx-auto min-h-full w-full max-w-[1180px] px-6 pb-28 pt-8 md:px-10 lg:px-12">
        {/* Back Button */}
        <Link
          href="/Admin/manageShowtime"
          className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-gray-300 transition hover:text-emerald-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to manage showtime
        </Link>

        {/* Header */}
        <div className="mx-auto mt-16 w-full max-w-[1120px]">
          <h1 className="text-4xl font-semibold tracking-tight text-emerald-500">
            เพิ่มรายละเอียดรอบฉาย
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Fill in the screening details to add a new showtime to the schedule.
          </p>

          {selectedDate ? (
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-emerald-300/85">
              <CalendarDays className="h-4 w-4" />
              <span>{selectedDate}</span>
            </div>
          ) : null}
        </div>

        {/* Form Card */}
        <section className="mx-auto mt-10 w-full max-w-[1120px] rounded-[8px] border border-[#556953] bg-[#52634f]/92 p-5 shadow-[0_24px_55px_rgba(0,0,0,0.24)] md:p-7">
          <form className="space-y-7">
            {/* Movie Name */}
            <label className="block space-y-3">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                Name Movie (ชื่อหนัง)
              </span>

              <div className="relative">
                <Clapperboard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#95a191]" />
                <input
                  type="text"
                  placeholder="ระบุ Movie ID หรือ Movie Name"
                  className="h-12 w-full rounded-[4px] border border-[#6b7c68] bg-[#536550] pl-11 pr-4 text-sm text-gray-100 outline-none placeholder:text-[#a1ac9f] focus:border-emerald-500"
                />
              </div>
            </label>

            {/* Branch + Theater */}
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block space-y-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Branch (สาขา)
                </span>

                <input
                  type="text"
                  placeholder="RANGSIT"
                  className="h-12 w-full rounded-[4px] border border-[#6b7c68] bg-[#536550] px-4 text-sm text-gray-100 outline-none placeholder:text-[#a1ac9f] focus:border-emerald-500"
                />
              </label>

              <label className="block space-y-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Theater (โรงภาพยนตร์)
                </span>

                <input
                  type="text"
                  placeholder="1"
                  className="h-12 w-full rounded-[4px] border border-[#6b7c68] bg-[#536550] px-4 text-sm text-gray-100 outline-none placeholder:text-[#a1ac9f] focus:border-emerald-500"
                />
              </label>
            </div>

            {/* Showtime + Price */}
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block space-y-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Showtime (เวลาที่ฉาย)
                </span>

                <input
                  type="text"
                  placeholder="-- : -- --"
                  className="h-12 w-full rounded-[4px] border border-[#6b7c68] bg-[#536550] px-4 text-center text-sm tracking-[0.2em] text-gray-100 outline-none placeholder:text-[#a1ac9f] focus:border-emerald-500"
                />
              </label>

              <label className="block space-y-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Price (ราคา)
                </span>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="240"
                    className="h-12 w-full rounded-[4px] border border-[#6b7c68] bg-[#536550] px-4 pr-16 text-sm text-gray-100 outline-none placeholder:text-[#a1ac9f] focus:border-emerald-500"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#d7ddd6]">
                    บาท
                  </span>
                </div>
              </label>
            </div>
          </form>
        </section>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#07110b] shadow-[0_14px_30px_rgba(16,185,129,0.25)] transition hover:bg-emerald-300 active:scale-95">
          <Save className="h-4 w-4" />
          Save
        </button>
      </div>
    </div>
  );
}