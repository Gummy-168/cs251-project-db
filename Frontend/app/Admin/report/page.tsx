'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Clapperboard, Calendar, Filter, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

import { getPerformanceLogs, getTrendingMovie, resolveMovieImage } from '@/services/api';
import type { PerformanceLogRecord, TrendingMovieReport } from '@/types/report';

const PAGE_LIMIT = 4;

function formatThaiDate(value: string) {
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function normalizeDateInput(value: string) {
  const cleaned = value.trim();

  if (!cleaned) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  const match = cleaned.match(/^(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})$/);
  if (!match) {
    return null;
  }

  const [, month, day, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function formatIncome(value: number | string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export default function ReportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [trendingMovie, setTrendingMovie] = useState<TrendingMovieReport | null>(null);
  const [performanceLogs, setPerformanceLogs] = useState<PerformanceLogRecord[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizedDate = useMemo(() => normalizeDateInput(dateRange), [dateRange]);
  const totalPages = Math.max(1, Math.ceil(totalLogs / PAGE_LIMIT));

  useEffect(() => {
    async function loadTrendingMovie() {
      try {
        setLoadingTrending(true);
        const movie = await getTrendingMovie();
        setTrendingMovie(movie);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลหนังกำลังมาแรงได้');
      } finally {
        setLoadingTrending(false);
      }
    }

    loadTrendingMovie();
  }, []);

  useEffect(() => {
    async function loadPerformanceLogs() {
      try {
        setLoadingLogs(true);
        setError(null);

        const response = await getPerformanceLogs({
          search: searchQuery,
          start_date: normalizedDate ?? undefined,
          end_date: normalizedDate ?? undefined,
          page: currentPage,
          limit: PAGE_LIMIT,
        });

        setPerformanceLogs(response.items);
        setTotalLogs(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลรายงานได้');
      } finally {
        setLoadingLogs(false);
      }
    }

    loadPerformanceLogs();
  }, [searchQuery, normalizedDate, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, normalizedDate]);

  const trendingImage = trendingMovie
    ? resolveMovieImage({
        MName: trendingMovie.MName,
      })
    : '/image/jujutsu.jpg';

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
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
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
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
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
          <h2 className="text-3xl font-bold text-gray-100 mb-4 tracking-wide">
            {loadingTrending
              ? 'กำลังโหลดข้อมูล...'
              : trendingMovie?.MName ?? 'ไม่มีข้อมูล'}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed pr-8">
            {loadingTrending
              ? 'กำลังโหลดรายละเอียดภาพยนตร์กำลังมาแรง'
              : trendingMovie?.Description ?? 'ยังไม่มีคำอธิบายสำหรับภาพยนตร์เรื่องนี้'}
          </p>
        </div>
        
        {/* Movie Poster Image */}
        <div className="w-48 shrink-0 rounded-lg overflow-hidden shadow-lg border border-[#2d4634]">
          <img 
            src={trendingImage} 
            alt={trendingMovie?.MName ?? 'Trending Movie'} 
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

        {error ? (
          <div className="mb-6 rounded-lg border border-red-400/25 bg-red-950/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

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
              {loadingLogs ? (
                <tr>
                  <td colSpan={5} className="py-5 text-gray-400">
                    กำลังโหลดข้อมูลรายงาน...
                  </td>
                </tr>
              ) : performanceLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-5 text-gray-400">
                    ไม่พบข้อมูลรายงานตามเงื่อนไขที่เลือก
                  </td>
                </tr>
              ) : (
                performanceLogs.map((log, index) => (
                  <tr key={`${log.MID}-${log.ShowDate}-${index}`} className="border-b border-[#2d4634]/50 hover:bg-[#24382a] transition-colors group">
                    <td className="py-5 text-emerald-500 font-medium">#{log.MID}</td>
                    <td className="py-5 text-gray-200 font-semibold">{log.MName}</td>
                    <td className="py-5 text-gray-400">{formatThaiDate(log.ShowDate)}</td>
                    <td className="py-5 text-gray-400">{Number(log.TCOUNT).toLocaleString()} Tickets</td>
                    <td className="py-5 text-emerald-400 font-bold text-right">{formatIncome(log.INCOME)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex justify-between items-center mt-8 text-xs font-medium text-gray-500">
          <p>Last sync: 2 mins ago</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="flex items-center gap-1 hover:text-gray-300 transition-colors uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              className="flex items-center gap-1 hover:text-gray-300 transition-colors uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
