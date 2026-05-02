'use client';

import React from 'react';
import { Clapperboard, Calendar, Filter, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReportPage() {
  const performanceLogs = [
    {
      id: '#EM-402',
      name: 'Detective Conan: Million-dollar Pentagram',
      date: 'ตุลา 24, 2569',
      tickets: '1,248',
      income: '15,480.00',
    },
    {
      id: '#EM-389',
      name: 'Dune: Part Two',
      date: 'ตุลา 24, 2569',
      tickets: '942',
      income: '12,150.00',
    },
    {
      id: '#EM-412',
      name: 'The Boy and the Heron',
      date: 'ตุลา 23, 2569',
      tickets: '856',
      income: '10,272.00',
    },
    {
      id: '#EM-395',
      name: 'Oppenheimer (Re-release)',
      date: 'ตุลา 23, 2569',
      tickets: '610',
      income: '7,320.00',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-6">
      
      {/* Top Filter Section */}
      <div className="bg-[#1b2b20] rounded-2xl p-6 flex items-center shadow-sm">
        {/* Search Filter */}
        <div className="flex-1 pr-8">
          <h3 className="text-gray-400 text-xs font-bold tracking-wider mb-3 uppercase">Search Filter</h3>
          <div className="flex items-center gap-3 text-emerald-500">
            <Clapperboard className="w-5 h-5" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อภาพยนตร์..." 
              className="bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 w-full text-sm font-medium"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-[#2d4634]"></div>

        {/* Date Range */}
        <div className="flex-1 pl-8">
          <h3 className="text-gray-400 text-xs font-bold tracking-wider mb-3 uppercase">Date Range</h3>
          <div className="flex items-center gap-3 text-emerald-500">
            <Calendar className="w-5 h-5" />
            <input 
              type="text" 
              placeholder="mm / dd / yyyy" 
              className="bg-transparent border-none outline-none text-gray-200 placeholder-gray-500 w-full text-sm font-medium tracking-wide"
            />
          </div>
        </div>
      </div>

      {/* Trending Movie Section */}
      <div className="bg-[#1b2b20] rounded-2xl p-8 flex justify-between items-stretch shadow-sm">
        <div className="max-w-2xl flex flex-col justify-center">
          <div>
            <span className="bg-[#243d2c] text-emerald-400 text-xs font-bold px-3 py-1.5 rounded mb-4 inline-block">
              กำลังมาแรง
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-2 font-medium">หนังยอดนิยม :</p>
          <h2 className="text-3xl font-bold text-gray-100 mb-4 tracking-wide">Jujutsu Kaisen 0 The Movie</h2>
          <p className="text-gray-400 text-sm leading-relaxed pr-8">
            เล่าเรื่องของ อคคทสึ ยูตะ เด็กหนุ่มที่ถูกคำสาประดับพิเศษจากวิญญาณของริกะ เพื่อนสมัยเด็กที่ตายไป 
            ยูตะเข้าเรียนที่โรงเรียนไสยเวทภายใต้การดูแลของโกโจ ซาโตรุ เพื่อฝึกควบคุมพลังและแก้คำสาป 
            โดยต้องเผชิญหน้ากับเกะโท สุงุรุ ที่หมายจะชิงพลังริกะ
          </p>
        </div>
        
        {/* Movie Poster Image */}
        <div className="w-48 shrink-0 rounded-lg overflow-hidden shadow-lg border border-[#2d4634]">
          <img 
            src="/image/jujutsu.jpg" 
            alt="Jujutsu Kaisen 0" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Performance Logs Section */}
      <div className="bg-[#1b2b20] rounded-2xl p-8 shadow-sm flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-100 tracking-wide">Performance Logs</h3>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-emerald-400 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button className="hover:text-emerald-400 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-widest border-b border-[#2d4634]">
                <th className="pb-4 font-semibold">MID</th>
                <th className="pb-4 font-semibold">MNAME</th>
                <th className="pb-4 font-semibold">DATE</th>
                <th className="pb-4 font-semibold">TCOUNT</th>
                <th className="pb-4 font-semibold text-right">INCOME</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {performanceLogs.map((log, index) => (
                <tr key={index} className="border-b border-[#2d4634]/50 hover:bg-[#24382a] transition-colors group">
                  <td className="py-5 text-emerald-500 font-medium">{log.id}</td>
                  <td className="py-5 text-gray-200 font-semibold">{log.name}</td>
                  <td className="py-5 text-gray-400">{log.date}</td>
                  <td className="py-5 text-gray-400">{log.tickets} Tickets</td>
                  <td className="py-5 text-emerald-400 font-bold text-right">฿{log.income}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex justify-between items-center mt-8 text-xs font-medium text-gray-500">
          <p>Last sync: 2 mins ago</p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-gray-300 transition-colors uppercase tracking-wider">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button className="flex items-center gap-1 hover:text-gray-300 transition-colors uppercase tracking-wider">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
