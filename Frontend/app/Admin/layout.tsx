'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Calendar, Clock, Film } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-[#0d1510] text-gray-200 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#0a100c] border-r border-[#1a291f] flex flex-col justify-between py-6">
        <div>
          {/* Logo Section */}
          <div className="px-6 mb-10">
            <h1 className="text-xl font-serif text-emerald-500 tracking-wide whitespace-nowrap">EMERALD CINEMA</h1>
            <p className="text-[10px] text-gray-500 font-semibold tracking-widest mt-1 uppercase">Projection Booth V1.0</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link 
              href="/Admin/report" 
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive('/Admin/report') 
                  ? 'text-emerald-400 bg-[#1e3326] border-l-4 border-emerald-500' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#152219]'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              REPORT
            </Link>

            <Link 
              href="/Admin/eventHandling" 
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive('/Admin/eventHandling') 
                  ? 'text-emerald-400 bg-[#1e3326] border-l-4 border-emerald-500' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#152219]'
              }`}
            >
              <Calendar className="w-5 h-5" />
              EVENT HANDLING
            </Link>

            <Link 
              href="/Admin/manageShowtime" 
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive('/Admin/manageShowtime') 
                  ? 'text-emerald-400 bg-[#1e3326] border-l-4 border-emerald-500' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#152219]'
              }`}
            >
              <Clock className="w-5 h-5" />
              MANAGE SHOWTIME
            </Link>

            <Link 
              href="#" 
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive('/Admin/editMovie') 
                  ? 'text-emerald-400 bg-[#1e3326] border-l-4 border-emerald-500' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#152219]'
              }`}
            >
              <Film className="w-5 h-5" />
              EDIT MOVIE
            </Link>
          </nav>
        </div>

        {/* Log Out Button */}
        <div className="px-6">
          <button className="w-full flex items-center justify-center gap-2 bg-[#2a3d31] hover:bg-[#344b3c] text-gray-300 py-2 rounded text-sm font-semibold transition-colors">
            LOG OUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}