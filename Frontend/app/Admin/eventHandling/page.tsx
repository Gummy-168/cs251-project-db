'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Search, Heart, Droplet, Ticket, Diamond, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { deleteAdminPromotion, getAdminPromotions } from '@/services/api';
import type { PromotionRecord } from '@/types/promotion';

function getPromotionIcon(index: number, promotionName: string) {
  const normalizedName = promotionName.toLowerCase();

  if (normalizedName.includes('valentine') || normalizedName.includes('love')) {
    return <Heart className="w-5 h-5 text-emerald-400" fill="currentColor" />;
  }

  if (normalizedName.includes('songkran') || normalizedName.includes('water')) {
    return <Droplet className="w-5 h-5 text-emerald-400" fill="currentColor" />;
  }

  if (normalizedName.includes('ticket') || normalizedName.includes('pass')) {
    return <Ticket className="w-5 h-5 text-emerald-400" fill="currentColor" />;
  }

  const iconOrder = [
    <Heart key="heart" className="w-5 h-5 text-emerald-400" fill="currentColor" />,
    <Droplet key="droplet" className="w-5 h-5 text-emerald-400" fill="currentColor" />,
    <Ticket key="ticket" className="w-5 h-5 text-emerald-400" fill="currentColor" />,
    <Diamond key="diamond" className="w-5 h-5 text-emerald-400" fill="currentColor" />,
  ];

  return iconOrder[index % iconOrder.length];
}

function formatThaiDate(value: string) {
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

export default function EventHandling() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadPromotions() {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminPromotions();
      setPromotions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลโปรโมชันได้');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPromotions();
  }, []);

  const filteredPromotions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return promotions;
    }

    return promotions.filter((promotion) =>
      promotion.PromotionName.toLowerCase().includes(keyword)
    );
  }, [promotions, search]);

  async function handleDeletePromotion(promotionId: number) {
    if (deletingId !== null) {
      return;
    }

    const confirmed = window.confirm('ต้องการลบโปรโมชันนี้ใช่หรือไม่');
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(promotionId);
      setError(null);
      await deleteAdminPromotion(promotionId);
      await loadPromotions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถลบโปรโมชันได้');
    } finally {
      setDeletingId(null);
    }
  }

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
            <Calendar className="w-5 h-5 text-emerald-500" />
            <span>ก.พ. 24, 2569</span>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search promotion name"
            className="w-full bg-[#1b2b20] text-white placeholder-gray-500 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-[#263c2c]"
          />
        </div>

        {/* Active Promotions Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold tracking-widest text-gray-300 uppercase">Active Promotions</h3>
            <span className="bg-[#1b2b20] text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full">
              {filteredPromotions.length} Events Scheduled
            </span>
          </div>

          {loading ? (
            <div className="rounded-lg border border-[#2d4634] bg-[#24382a] p-4 text-sm text-gray-300">
              กำลังโหลดข้อมูลโปรโมชัน...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-red-400/25 bg-red-950/30 p-4 text-sm text-red-100 mb-3">
              {error}
            </div>
          ) : null}

          {!loading && filteredPromotions.length === 0 ? (
            <div className="rounded-lg border border-[#2d4634] bg-[#24382a] p-4 text-sm text-gray-300">
              ไม่พบโปรโมชันที่ต้องการ
            </div>
          ) : null}

          {/* Promotion List */}
          <div className="space-y-3">
            {filteredPromotions.map((promo, index) => (
              <div
                key={promo.PromotionID}
                onClick={() => router.push(`/Admin/eventHandling/promotion?id=${promo.PromotionID}`)}
                className="flex items-center justify-between bg-[#24382a] rounded-lg p-4 border border-[#2d4634] hover:bg-[#2a4231] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#19271e] p-2 rounded-md">
                    {getPromotionIcon(index, promo.PromotionName)}
                  </div>
                  <span className="font-semibold text-gray-100">{promo.PromotionName}</span>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-emerald-400 text-xs font-bold mb-0.5">EXPIRES</p>
                    <p className="text-gray-300 text-sm font-medium">Due: {formatThaiDate(promo.EndDate)}</p>
                  </div>
                  <button
                    type="button"
                    disabled={deletingId === promo.PromotionID}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeletePromotion(promo.PromotionID);
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors p-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link href="/Admin/eventHandling/promotion" className="absolute bottom-10 right-10 w-14 h-14 bg-emerald-400 hover:bg-emerald-300 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50 transition-colors">
        <Plus className="w-8 h-8 text-[#0a100c]" />
      </Link>
    </>
  );
}
