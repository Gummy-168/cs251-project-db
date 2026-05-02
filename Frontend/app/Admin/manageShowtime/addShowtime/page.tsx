'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clapperboard, Save } from 'lucide-react';
import { createAdminShowtime, getAdminShowtimes, getMovies } from '@/services/api';

const SHOWTIME_STORAGE_KEY = 'emerald_admin_showtimes';

export default function AddShowtimePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get('date');

  const [movieInput, setMovieInput] = useState('');
  const [branchInput, setBranchInput] = useState('RANGSIT');
  const [theaterInput, setTheaterInput] = useState('1');
  const [showtimeInput, setShowtimeInput] = useState('');
  const [priceInput, setPriceInput] = useState('240');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isValidShowtime = useMemo(() => /^([01]\d|2[0-3]):([0-5]\d)$/.test(showtimeInput), [showtimeInput]);

  function buildEndTime(startTime: string) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const start = new Date(2000, 0, 1, hours, minutes, 0);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const isCrossingDay = end.getDate() !== start.getDate();
    if (isCrossingDay) {
      return null;
    }
    return `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}:00`;
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const movieValue = movieInput.trim();
    const branchValue = branchInput.trim();
    const theaterValue = theaterInput.trim();
    const priceNumber = Number(priceInput);

    if (!movieValue) {
      setError('กรุณาระบุชื่อหนังหรือ Movie ID');
      return;
    }

    if (!branchValue) {
      setError('กรุณาระบุสาขา');
      return;
    }

    if (!theaterValue) {
      setError('กรุณาระบุโรงภาพยนตร์');
      return;
    }

    if (!isValidShowtime) {
      setError('กรุณาระบุ Showtime เป็นรูปแบบเวลา HH:mm');
      return;
    }

    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setError('กรุณาระบุราคาให้ถูกต้อง');
      return;
    }

    const showDate = selectedDate ?? new Date().toISOString().slice(0, 10);
    setSaving(true);
    setError(null);

    try {
<<<<<<< HEAD
      const createdShowtime = await createAdminShowtime({
        MovieKeyword: movieValue,
        Branch: branchValue,
        Theater: theaterValue,
        ShowDate: showDate,
        StartTime: showtimeInput,
=======
      const movies = await getMovies();
      const normalizedMovieValue = movieValue.toLowerCase();
      const parsedMovieId = Number(movieValue);
      const matchedMovie = Number.isInteger(parsedMovieId) && parsedMovieId > 0
        ? movies.find((movie) => movie.id === parsedMovieId)
        : movies.find((movie) => movie.title.toLowerCase() === normalizedMovieValue);

      if (!matchedMovie) {
        throw new Error('ไม่พบหนังในฐานข้อมูล กรุณาระบุ Movie ID หรือชื่อหนังให้ตรง');
      }

      const showtimeRows = await getAdminShowtimes();
      const parsedTheaterNumber = Number(theaterValue);
      const matchedTheater = showtimeRows.find(
        (row) =>
          row.BName.toLowerCase() === branchValue.toLowerCase() &&
          row.ThNumber === parsedTheaterNumber,
      );

      if (!matchedTheater) {
        throw new Error('ไม่พบโรงภาพยนตร์ของสาขานี้ในฐานข้อมูล');
      }

      const endTime = buildEndTime(showtimeInput);
      if (!endTime) {
        throw new Error('เวลาฉายต้องก่อน 22:00 เพราะระบบตั้ง EndTime อัตโนมัติ +2 ชั่วโมง');
      }

      await createAdminShowtime({
        MID: matchedMovie.id,
        ThID: matchedTheater.ThID,
        ShowDate: showDate,
        StartTime: `${showtimeInput}:00`,
        EndTime: endTime,
>>>>>>> 3eb04d1 (Fix Show time)
      });

      try {
        const rawSchedule = window.localStorage.getItem(SHOWTIME_STORAGE_KEY);
        const parsedSchedule = rawSchedule ? JSON.parse(rawSchedule) : [];

        if (Array.isArray(parsedSchedule)) {
          const normalizedBranch = branchValue.charAt(0).toUpperCase() + branchValue.slice(1).toLowerCase();
          const theaterLabel = `Theater ${theaterValue}`;
          const showtimeEntry = {
            id: `db-showtime-${createdShowtime.ShowtimeID}`,
            time: createdShowtime.StartTime.slice(0, 5),
            price: priceNumber.toFixed(1),
            showDate,
          };

          const branchIndex = parsedSchedule.findIndex(
            (branch) =>
              typeof branch?.branch === 'string' &&
              branch.branch.toLowerCase() === normalizedBranch.toLowerCase()
          );

          if (branchIndex >= 0) {
            const branch = parsedSchedule[branchIndex];
            const theaterIndex = Array.isArray(branch.theaters)
              ? branch.theaters.findIndex(
                  (theater: { id?: string }) =>
                    typeof theater?.id === 'string' &&
                    theater.id.toLowerCase() === theaterLabel.toLowerCase()
                )
              : -1;

            if (theaterIndex >= 0) {
              branch.theaters[theaterIndex].showtimes = [
                ...(branch.theaters[theaterIndex].showtimes ?? []),
                showtimeEntry,
              ];
            } else {
              branch.theaters = [
                ...(branch.theaters ?? []),
                {
                  id: theaterLabel,
                  type: 'STANDARD',
                  showtimes: [showtimeEntry],
                },
              ];
            }

            parsedSchedule[branchIndex] = branch;
          } else {
            parsedSchedule.push({
              branch: normalizedBranch,
              theaters: [
                {
                  id: theaterLabel,
                  type: 'STANDARD',
                  showtimes: [showtimeEntry],
                },
              ],
            });
          }

          window.localStorage.setItem(
            SHOWTIME_STORAGE_KEY,
            JSON.stringify(parsedSchedule)
          );
        }
      } catch {
        // Keep DB create success even if local cache update fails.
      }

      router.push('/Admin/manageShowtime');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกรอบฉายลงฐานข้อมูลได้');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_bottom,_rgba(61,88,64,0.34),_rgba(25,39,28,1)_54%)] text-gray-100">
      <div className="mx-auto min-h-full w-full max-w-[1180px] px-6 pb-28 pt-8 md:px-10 lg:px-12">
        <Link
          href="/Admin/manageShowtime"
          className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-gray-300 transition hover:text-emerald-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to manage showtime
        </Link>

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

        <section className="mx-auto mt-10 w-full max-w-[1120px] rounded-[8px] border border-[#556953] bg-[#52634f]/92 p-5 shadow-[0_24px_55px_rgba(0,0,0,0.24)] md:p-7">
          <form className="space-y-7" onSubmit={handleSave}>
            <label className="block space-y-3">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                Name Movie (ชื่อหนัง)
              </span>

              <div className="relative">
                <Clapperboard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#95a191]" />
                <input
                  type="text"
                  value={movieInput}
                  onChange={(event) => setMovieInput(event.target.value)}
                  placeholder="ระบุ Movie ID หรือ Movie Name"
                  className="h-12 w-full rounded-[4px] border border-[#6b7c68] bg-[#536550] pl-11 pr-4 text-sm text-gray-100 outline-none placeholder:text-[#a1ac9f] focus:border-emerald-500"
                  required
                />
              </div>
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block space-y-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Branch (สาขา)
                </span>

                <input
                  type="text"
                  value={branchInput}
                  onChange={(event) => setBranchInput(event.target.value)}
                  placeholder="RANGSIT"
                  className="h-12 w-full rounded-[4px] border border-[#6b7c68] bg-[#536550] px-4 text-sm text-gray-100 outline-none placeholder:text-[#a1ac9f] focus:border-emerald-500"
                  required
                />
              </label>

              <label className="block space-y-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Theater (โรงภาพยนตร์)
                </span>

                <input
                  type="text"
                  value={theaterInput}
                  onChange={(event) => setTheaterInput(event.target.value.replace(/[^0-9A-Za-z\s-]/g, ''))}
                  placeholder="1"
                  className="h-12 w-full rounded-[4px] border border-[#6b7c68] bg-[#536550] px-4 text-sm text-gray-100 outline-none placeholder:text-[#a1ac9f] focus:border-emerald-500"
                  required
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block space-y-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Showtime (เวลาที่ฉาย)
                </span>

                <input
                  type="time"
                  value={showtimeInput}
                  onChange={(event) => setShowtimeInput(event.target.value)}
                  className="h-12 w-full rounded-[4px] border border-[#6b7c68] bg-[#536550] px-4 text-center text-sm tracking-[0.2em] text-gray-100 outline-none placeholder:text-[#a1ac9f] focus:border-emerald-500"
                  step={60}
                  required
                />
              </label>

              <label className="block space-y-3">
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Price (ราคา)
                </span>

                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={1}
                    value={priceInput}
                    onChange={(event) => setPriceInput(event.target.value)}
                    placeholder="240"
                    className="h-12 w-full rounded-[4px] border border-[#6b7c68] bg-[#536550] px-4 pr-16 text-sm text-gray-100 outline-none placeholder:text-[#a1ac9f] focus:border-emerald-500"
                    required
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#d7ddd6]">
                    บาท
                  </span>
                </div>
              </label>
            </div>

            {error ? (
              <p className="rounded-md border border-red-400/25 bg-red-950/30 px-4 py-3 text-sm text-red-100">{error}</p>
            ) : null}

            <div className="fixed bottom-6 right-6 z-20">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#07110b] shadow-[0_14px_30px_rgba(16,185,129,0.25)] transition hover:bg-emerald-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-65"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
