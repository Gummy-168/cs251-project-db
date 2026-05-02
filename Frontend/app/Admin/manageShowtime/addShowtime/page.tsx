'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Clapperboard } from 'lucide-react';

export default function AddShowtimePage() {
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get('date');

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-[#0d1510] relative">
      {/* Back Link */}
      <Link 
        href="/Admin/manageShowtime" 
        className="inline-flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-colors text-xs font-bold tracking-widest uppercase mb-10 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to manage showtime
      </Link>

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-emerald-500 mb-3 tracking-wide">เพิ่มรายละเอียดรอบฉาย</h2>
        <p className="text-gray-400 text-sm">Fill in the screening details to add a new showtime to the schedule.</p>
        {selectedDate ? (
          <p className="mt-3 text-sm font-medium text-emerald-300">Selected date: {selectedDate}</p>
        ) : null}
      </div>

      {/* Form Card */}
      <div className="bg-[#1b2b20] border border-[#2d4634] rounded-2xl p-8 max-w-3xl space-y-8 shadow-lg">
        
        {/* Name Movie */}
        <div>
          <label className="block text-emerald-500 text-xs font-bold tracking-widest uppercase mb-3">
            Name Movie (ชื่อหนัง)
          </label>
          <div className="relative">
            <Clapperboard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="ระบุ Movie ID หรือ Movie Name" 
              className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 pl-12 pr-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Branch & Theater Row */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-emerald-500 text-xs font-bold tracking-widest uppercase mb-3">
              Branch (สาขา)
            </label>
            <input 
              type="text" 
              placeholder="RANGSIT" 
              className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-emerald-500 text-xs font-bold tracking-widest uppercase mb-3">
              Theater (โรงภาพยนตร์)
            </label>
            <input 
              type="text" 
              placeholder="1" 
              className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Showtime & Price Row */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-emerald-500 text-xs font-bold tracking-widest uppercase mb-3">
              Showtime (เวลาที่ฉาย)
            </label>
            <input 
              type="text" 
              placeholder="-- : -- --" 
              className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors text-center tracking-widest"
            />
          </div>
          <div>
            <label className="block text-emerald-500 text-xs font-bold tracking-widest uppercase mb-3">
              Price (ราคา)
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="240" 
                className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                บาท
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Save Button */}
      <button className="absolute bottom-10 right-10 flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-[#0a100c] px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/40 transition-all active:scale-95 uppercase tracking-wider text-sm">
        <Save className="w-5 h-5" />
        Save
      </button>
    </div>
  );
}
