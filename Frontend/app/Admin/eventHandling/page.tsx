'use client';

import React from 'react';
import { Calendar, Search, Heart, Droplet, Ticket, Diamond, Trash2, Plus } from 'lucide-react';

export default function EventHandling() {
  const promotions = [
    {
      id: 1,
      title: 'Valentine 2026',
      due: '28/02/2569',
      icon: <Heart className="w-5 h-5 text-emerald-400" fill="currentColor" />,
    },
    {
      id: 2,
      title: 'Songkran 2026',
      due: '15/04/2569',
      icon: <Droplet className="w-5 h-5 text-emerald-400" fill="currentColor" />,
    },
    {
      id: 3,
      title: 'Blockbuster Summer Pass',
      due: '30/06/2569',
      icon: <Ticket className="w-5 h-5 text-emerald-400" fill="currentColor" />,
    },
    {
      id: 4,
      title: 'Concession Combo Deal',
      due: '01/01/2569',
      icon: <Diamond className="w-5 h-5 text-emerald-400" fill="currentColor" />,
    },
  ];

  return (
    <>
      <div className="flex-1 overflow-y-auto p-10">
        {/* Header */}
        <header className="flex justify-between items-end mb-8">
          <div>
            <p className="text-emerald-500 text-xs font-bold tracking-wider uppercase mb-1">Management</p>
            <h2 className="text-3xl font-bold text-white">Event Handling</h2>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            {/* Added text-emerald-500 specifically to this icon component */}
            <Calendar className="w-5 h-5 text-emerald-500" />
            <span>ก.พ. 24, 2569</span>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search promotion name" 
            className="w-full bg-[#1b2b20] text-white placeholder-gray-500 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-[#263c2c]"
          />
        </div>

        {/* Active Promotions Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold tracking-widest text-gray-300 uppercase">Active Promotions</h3>
            <span className="bg-[#1b2b20] text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
              12 Events Scheduled
            </span>
          </div>

          {/* Promotion List */}
          <div className="space-y-3">
            {promotions.map((promo) => (
              <div 
                key={promo.id} 
                className="flex items-center justify-between bg-[#24382a] rounded-lg p-4 border border-[#2d4634] hover:bg-[#2a4231] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#19271e] p-2 rounded-md">
                    {promo.icon}
                  </div>
                  <span className="font-semibold text-gray-100">{promo.title}</span>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-emerald-400 text-xs font-bold mb-0.5">EXPIRES</p>
                    <p className="text-gray-300 text-sm font-medium">Due: {promo.due}</p>
                  </div>
                  <button className="text-gray-500 hover:text-red-400 transition-colors p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="absolute bottom-10 right-10 w-14 h-14 bg-emerald-400 hover:bg-emerald-300 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50 transition-colors">
        <Plus className="w-8 h-8 text-[#0a100c]" />
      </button>
    </>
  );
}