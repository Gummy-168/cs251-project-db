'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, PlusCircle, Trash2, CalendarPlus, X } from 'lucide-react';

type Showtime = {
  id: string;
  time: string;
  price: string;
};

type Theater = {
  id: string;
  type: string;
  showtimes: Showtime[];
};

type BranchSchedule = {
  branch: string;
  theaters: Theater[];
};

const initialScheduleData: BranchSchedule[] = [
  {
    branch: 'Rangsit',
    theaters: [
      {
        id: 'Theater 1',
        type: 'DIGITAL 4K',
        showtimes: [
          { id: 'rangsit-t1-2000', time: '20:00', price: '399.0' },
          { id: 'rangsit-t1-2230', time: '22:30', price: '399.0' },
        ],
      },
      {
        id: 'Theater 2',
        type: 'IMAX LASER',
        showtimes: [{ id: 'rangsit-t2-1500', time: '15:00', price: '450.0' }],
      },
    ],
  },
  {
    branch: 'Silom',
    theaters: [
      {
        id: 'Theater 10',
        type: 'EXECUTIVE SUITE',
        showtimes: [{ id: 'silom-t10-1800', time: '18:00', price: '350.0' }],
      },
    ],
  },
];

export default function ManageShowtimePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [scheduleData, setScheduleData] = useState(initialScheduleData);

  // Sync React state with the native Dialog API
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isModalOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isModalOpen]);

  const handleDeleteShowtime = (showtimeId: string) => {
    setScheduleData((currentSchedules) =>
      currentSchedules
        .map((branch) => ({
          ...branch,
          theaters: branch.theaters
            .map((theater) => ({
              ...theater,
              showtimes: theater.showtimes.filter((showtime) => showtime.id !== showtimeId),
            }))
            .filter((theater) => theater.showtimes.length > 0),
        }))
        .filter((branch) => branch.theaters.length > 0),
    );
  };

  const handleConfirmDate = () => {
    const nextDate = selectedDate || new Date().toISOString().slice(0, 10);
    setIsModalOpen(false);
    router.push(`/Admin/manageShowtime/addShowtime?date=${encodeURIComponent(nextDate)}`);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-10 flex flex-col">
        {/* Header Title */}
        <h2 className="text-emerald-500 text-xs font-bold tracking-widest uppercase mb-6">
          Manage Showtime
        </h2>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search Movie ID / Movie Name" 
            className="w-full bg-[#1b2b20] text-white placeholder-gray-500 rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-[#2d4634]"
          />
        </div>

        {/* Date and Create Actions Row */}
        <div className="grid grid-cols-[2fr_1fr] gap-6 mb-12">
          {/* Current Date Card */}
          <div className="bg-[#1b2b20] rounded-xl p-6 border border-[#2d4634] flex flex-col justify-center">
            <p className="text-emerald-500 text-sm font-semibold mb-1">กำหนดการวันฉาย</p>
            <h3 className="text-4xl font-bold text-gray-100">10 กุมภาพันธ์ 2569</h3>
          </div>

          {/* Create New Showtime Button (Triggers Modal) */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-[#0a100c] shadow-lg shadow-emerald-900/20 group w-full cursor-pointer"
          >
            <PlusCircle className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg tracking-wide">Create New Showtime</span>
          </button>
        </div>

        {/* Branches and Theaters List */}
        <div className="flex flex-col gap-12">
          {scheduleData.map((branch, branchIndex) => (
            <div key={branchIndex}>
              <h3 className="text-2xl font-bold text-white flex items-center mb-6">
                <span className="w-1.5 h-7 bg-emerald-500 rounded-full mr-3"></span>
                {branch.branch}
              </h3>

              <div className="flex flex-col gap-6">
                {branch.theaters.map((theater, theaterIndex) => (
                  <div key={theaterIndex} className="bg-[#1b2b20] border border-[#2d4634] rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-[#152219] px-6 py-4 flex justify-between items-center border-b border-[#2d4634]">
                      <span className="text-gray-300 font-bold text-sm tracking-wide">{theater.id}</span>
                      <span className="text-emerald-500/80 font-bold text-xs tracking-widest uppercase">{theater.type}</span>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                      {theater.showtimes.map((show) => (
                        <div 
                          key={show.id} 
                          className="flex items-center justify-between bg-[#111a14] border border-[#2d4634] rounded-lg p-4 hover:border-emerald-500/50 transition-colors"
                        >
                          <div className="flex items-center gap-8">
                            <div className="border border-emerald-500 text-emerald-400 font-bold text-lg px-4 py-2 rounded-md bg-[#0a100c]">
                              {show.time}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-0.5">Price</span>
                              <span className="text-gray-200 font-bold text-sm">{show.price} บาท</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteShowtime(show.id)}
                            className="p-3 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <Link 
        href="/Admin/manageShowtime/addShowtime"
        className="absolute bottom-10 right-10 w-14 h-14 bg-emerald-400 hover:bg-emerald-300 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50 transition-colors z-40"
      >
        <CalendarPlus className="w-7 h-7 text-[#0a100c]" />
      </Link>

      <dialog 
        ref={dialogRef}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 m-0 p-0 bg-transparent backdrop:bg-black/80 backdrop:backdrop-blur-sm focus:outline-none z-50 w-full h-full border-none max-w-full max-h-full overflow-hidden"
      >
        {/* Centering Wrapper: This is the secret sauce */}
        <div className="flex items-center justify-center w-full h-full" onClick={() => setIsModalOpen(false)}>
          <div 
            className="bg-[#152219] border border-[#2d4634] rounded-2xl p-8 w-[400px] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()} // Prevents clicks inside from closing
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-emerald-400 text-xl font-bold mb-2">Select Date</h3>
            <p className="text-gray-400 text-sm mb-6">Choose a date to create a new showtime schedule.</p>
            
            <input 
              type="date" 
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="w-full bg-[#0a100c] text-white border border-[#2d4634] rounded-lg p-3 mb-8 focus:outline-none focus:border-emerald-500"
              style={{ colorScheme: 'dark' }}
            />
            
            <div className="flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-gray-400 hover:text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleConfirmDate}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#0a100c] font-bold rounded-lg transition-colors"
              >
                Confirm Date
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
