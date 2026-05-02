'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, PlusCircle, Trash2, CalendarPlus, X } from 'lucide-react';

import { deleteAdminShowtime, getAdminShowtimes } from '@/services/api';
import type { BackendAdminShowtimeListRecord } from '@/types/booking';

type UiShowtime = {
  id: number;
  time: string;
};

type UiTheater = {
  id: string;
  type: string;
  showtimes: UiShowtime[];
};

type UiBranchSchedule = {
  branch: string;
  theaters: UiTheater[];
};

export default function ManageShowtimePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<BackendAdminShowtimeListRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const effectiveDate = selectedDate || new Date().toISOString().slice(0, 10);

  async function loadShowtimes() {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminShowtimes({
        showDate: effectiveDate,
        movieName: query.trim() || undefined,
      });
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลรอบฉายได้');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShowtimes();
  }, [effectiveDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadShowtimes();
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isModalOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isModalOpen]);

  const visibleScheduleData = useMemo<UiBranchSchedule[]>(() => {
    const branchMap = new Map<string, UiBranchSchedule>();

    for (const row of rows) {
      const branchKey = `${row.BID}`;
      const theaterName = `Theater ${row.ThNumber}`;
      const theaterKey = `${row.ThID}`;

      if (!branchMap.has(branchKey)) {
        branchMap.set(branchKey, {
          branch: row.BName,
          theaters: [],
        });
      }

      const branch = branchMap.get(branchKey)!;
      let theater = branch.theaters.find((item) => item.id === theaterKey);

      if (!theater) {
        theater = {
          id: theaterName,
          type: row.ThType,
          showtimes: [],
        };
        branch.theaters.push(theater);
      }

      theater.showtimes.push({
        id: row.ShowtimeID,
        time: row.StartTime,
      });
    }

    return Array.from(branchMap.values());
  }, [rows]);

  async function handleDeleteShowtime(showtimeId: number) {
    const isConfirmed = window.confirm('ยืนยันการลบรอบฉายนี้?');
    if (!isConfirmed) {
      return;
    }

    try {
      await deleteAdminShowtime(showtimeId);
      await loadShowtimes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ลบรอบฉายไม่สำเร็จ');
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-10 flex flex-col">
        <h2 className="text-emerald-500 text-xs font-bold tracking-widest uppercase mb-6">
          Manage Showtime
        </h2>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Movie ID / Movie Name"
            className="w-full bg-[#1b2b20] text-white placeholder-gray-500 rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-[#2d4634]"
          />
        </div>

        <div className="grid grid-cols-[2fr_1fr] gap-6 mb-12">
          <div className="bg-[#1b2b20] rounded-xl p-6 border border-[#2d4634] flex flex-col justify-center">
            <p className="text-emerald-500 text-sm font-semibold mb-1">กำหนดการวันฉาย</p>
            <h3 className="text-4xl font-bold text-gray-100">{effectiveDate}</h3>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-[#0a100c] shadow-lg shadow-emerald-900/20 group w-full cursor-pointer"
          >
            <PlusCircle className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg tracking-wide">Change Date</span>
          </button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-[#2d4634] bg-[#1b2b20] p-6 text-sm text-gray-300">
            กำลังโหลดข้อมูลรอบฉาย...
          </div>
        ) : null}

        {error ? (
          <div className="mb-8 rounded-xl border border-red-400/30 bg-red-950/30 p-6 text-sm text-red-100">
            ไม่สามารถโหลดข้อมูลรอบฉายได้: {error}
          </div>
        ) : null}

        {!loading && !error && visibleScheduleData.length === 0 ? (
          <div className="rounded-xl border border-[#2d4634] bg-[#1b2b20] p-6 text-sm text-gray-300">
            ยังไม่มีรอบฉายในวันที่เลือก
          </div>
        ) : null}

        <div className="flex flex-col gap-12">
          {visibleScheduleData.map((branch, branchIndex) => (
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

      <Link
        href={`/Admin/manageShowtime/addShowtime?date=${encodeURIComponent(
          effectiveDate,
        )}`}
        className="absolute bottom-10 right-10 w-14 h-14 bg-emerald-400 hover:bg-emerald-300 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50 transition-colors z-40"
      >
        <CalendarPlus className="w-7 h-7 text-[#0a100c]" />
      </Link>

      <dialog
        ref={dialogRef}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 m-0 p-0 bg-transparent backdrop:bg-black/80 backdrop:backdrop-blur-sm focus:outline-none z-50 w-full h-full border-none max-w-full max-h-full overflow-hidden"
      >
        <div className="flex items-center justify-center w-full h-full" onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-[#152219] border border-[#2d4634] rounded-2xl p-8 w-[400px] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
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
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
