'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

import {
  createAdminPromotion,
  getAdminPromotions,
  updateAdminPromotion,
} from '@/services/api';

function formatDateForInput(value: string) {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${month} / ${day} / ${year}`;
}

function normalizeDateInput(value: string) {
  const cleaned = value.trim();

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

function toApiDiscountType(value: string) {
  if (value === 'Cash Discount') {
    return 'Fixed Amount';
  }

  if (value === 'Percentage Discount') {
    return 'Percentage';
  }

  return null;
}

function toUiDiscountType(value: string) {
  if (value === 'Fixed Amount') {
    return 'Cash Discount';
  }

  if (value === 'Percentage') {
    return 'Percentage Discount';
  }

  return 'Buy 1 Get 1';
}

export default function NewPromotionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promotionId = searchParams.get('id');
  const editingId = promotionId ? Number(promotionId) : null;

  const [promotionName, setPromotionName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [promotionType, setPromotionType] = useState('Cash Discount');
  const [discountValue, setDiscountValue] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editingId || !Number.isInteger(editingId) || editingId <= 0) {
      return;
    }

    async function loadPromotion() {
      try {
        setLoading(true);
        setError(null);
        const promotions = await getAdminPromotions();
        const promotion = promotions.find((item) => item.PromotionID === editingId);

        if (!promotion) {
          setError('ไม่พบข้อมูลโปรโมชันที่ต้องการแก้ไข');
          return;
        }

        setPromotionName(promotion.PromotionName);
        setStartDate(formatDateForInput(promotion.StartDate));
        setEndDate(formatDateForInput(promotion.EndDate));
        setPromotionType(toUiDiscountType(promotion.DiscountType));
        setDiscountValue(String(promotion.DiscountValue));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลโปรโมชันได้');
      } finally {
        setLoading(false);
      }
    }

    loadPromotion();
  }, [editingId]);

  const isEditing = useMemo(
    () => Boolean(editingId && Number.isInteger(editingId) && editingId > 0),
    [editingId]
  );

  async function handleSave() {
    const normalizedStartDate = normalizeDateInput(startDate);
    const normalizedEndDate = normalizeDateInput(endDate);
    const discountType = toApiDiscountType(promotionType);
    const parsedDiscountValue = Number(discountValue);

    if (!promotionName.trim()) {
      setError('กรุณากรอกชื่อโปรโมชัน');
      return;
    }

    if (!normalizedStartDate) {
      setError('กรุณากรอก Start Date ในรูปแบบ mm / dd / yyyy');
      return;
    }

    if (!normalizedEndDate) {
      setError('กรุณากรอก End Date ในรูปแบบ mm / dd / yyyy');
      return;
    }

    if (!discountType) {
      setError('ประเภทโปรโมชันนี้ยังไม่รองรับในระบบฐานข้อมูลปัจจุบัน');
      return;
    }

    if (!Number.isFinite(parsedDiscountValue) || parsedDiscountValue < 0) {
      setError('กรุณากรอก Discount Value ให้ถูกต้อง');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        PromotionName: promotionName.trim(),
        DiscountType: discountType,
        DiscountValue: parsedDiscountValue,
        StartDate: normalizedStartDate,
        EndDate: normalizedEndDate,
      } as const;

      if (isEditing && editingId) {
        await updateAdminPromotion(editingId, payload);
      } else {
        await createAdminPromotion({
          ...payload,
          AID: 1,
        });
      }

      router.push('/Admin/eventHandling');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกโปรโมชันได้');
    } finally {
      setSaving(false);
    }
  }

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
        {loading ? (
          <div className="rounded-lg border border-[#2d4634] bg-[#152219] px-4 py-3 text-sm text-gray-300">
            กำลังโหลดข้อมูลโปรโมชัน...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-400/25 bg-red-950/30 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        {/* Promotion Name */}
        <div>
          <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Promotion Name</label>
          <input
            type="text"
            value={promotionName}
            onChange={(event) => setPromotionName(event.target.value)}
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
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              placeholder="mm / dd / yyyy"
              className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">End Date</label>
            <input
              type="text"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              placeholder="mm / dd / yyyy"
              className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Type and Value Row */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-gray-400 text-xs font-bold tracking-widest uppercase mb-3">Promotion Type</label>
            <select
              value={promotionType}
              onChange={(event) => setPromotionType(event.target.value)}
              className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
            >
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
                value={discountValue}
                onChange={(event) => setDiscountValue(event.target.value)}
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
            value={redeemCode}
            onChange={(event) => setRedeemCode(event.target.value)}
            placeholder="Code"
            className="w-full bg-[#152219] border border-[#2d4634] rounded-lg py-3 px-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Floating Save Button */}
      <button
        type="button"
        disabled={saving || loading}
        onClick={handleSave}
        className="absolute bottom-10 right-10 flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-[#0a100c] px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/40 transition-all active:scale-95 uppercase tracking-wider text-sm disabled:cursor-not-allowed disabled:opacity-65"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
