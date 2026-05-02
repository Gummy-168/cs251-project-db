'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewPromotionPage() {
  return (
    <div className="flex-1 overflow-y-auto p-12 bg-[#0d1510]">
      {/* Back Button */}
      <Link 
        href="/Admin/eventHandling" 
        className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors text-sm mb-10 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to event handling
      </Link>

      {/* Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-white mb-2">New Promotion</h2>
        <p className="text-gray-400 text-sm">กำหนดแคมเปญรางวัลหรือส่วนลดใหม่สำหรับผู้ชมภาพยนตร์</p>
      </div>

      {/* Form Area */}
      <div className="max-w-4xl space-y-8">
        {/* Promotion Name */}
        <div>
          <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Promotion Name</label>
          <input 
            type="text" 
            placeholder="e.g. Summer Blockbuster Weekend" 
            className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Date Row */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Start Date</label>
            <input 
              type="text" 
              placeholder="mm / dd / yyyy" 
              className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">End Date</label>
            <input 
              type="text" 
              placeholder="mm / dd / yyyy" 
              className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Type and Value Row */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Promotion Type</label>
            <select className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer">
              <option>Cash Discount</option>
              <option>Percentage Discount</option>
              <option>Buy 1 Get 1</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Discount Value</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="0.00" 
                className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 text-xs font-bold bg-[#1e3326] px-2 py-1 rounded">
                บาท
              </span>
            </div>
          </div>
        </div>

        {/* Code Redeem */}
        <div className="max-w-md">
          <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Code Redeem</label>
          <input 
            type="text" 
            placeholder="Code" 
            className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
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