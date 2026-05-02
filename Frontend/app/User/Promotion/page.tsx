"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getActivePromotions } from "@/services/api";
import type { PromotionRecord } from "@/types/promotion";

const navItems = [
  { label: "หน้าหลัก", href: "/User/Home" },
  { label: "ภาพยนตร์", href: "/User/Movies" },
  { label: "โปรโมชั่น", href: "/User/Promotion" },
  { label: "ตั๋วของฉัน", href: "/User/Ticket" },
];

const promotionImages = [
  "/image/Summer Blockbuster.png",
  "/image/Movie Night Combo.png",
  "/image/Emerald Member Card.png",
  "/image/Early Bird Tickets.png",
  "/image/Jujutsu Kaisen 0.png.webp",
  "/image/Old Town Stories.png",
];

function formatPromotionDescription(promotion: PromotionRecord) {
  const value = Number(promotion.DiscountValue);

  if (promotion.DiscountType === "Percentage") {
    return `รับส่วนลด ${value}% สำหรับโปรโมชัน ${promotion.PromotionName} ตั้งแต่ ${promotion.StartDate} ถึง ${promotion.EndDate}`;
  }

  return `รับส่วนลด ${value.toLocaleString()} บาท สำหรับโปรโมชัน ${promotion.PromotionName} ตั้งแต่ ${promotion.StartDate} ถึง ${promotion.EndDate}`;
}

function formatPromotionBadge(promotion: PromotionRecord) {
  const value = Number(promotion.DiscountValue);

  if (promotion.DiscountType === "Percentage") {
    return `-${value}%`;
  }

  return "SAVE";
}

export default function PromotionPage() {
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPromotions() {
      try {
        setLoading(true);
        setError(null);
        const data = await getActivePromotions();
        setPromotions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "ไม่สามารถโหลดโปรโมชั่นได้");
      } finally {
        setLoading(false);
      }
    }

    loadPromotions();
  }, []);

  const promotionCards = useMemo(
    () =>
      promotions.map((promotion, index) => ({
        ...promotion,
        image: promotionImages[index % promotionImages.length],
        badge: formatPromotionBadge(promotion),
        description: formatPromotionDescription(promotion),
      })),
    [promotions]
  );

  return (
    <main className="min-h-screen bg-[#06160a] text-[#d4e9d2]">
      <nav className="fixed left-0 top-0 z-50 flex h-[72px] w-full items-center bg-[#06160a] px-8">
        <Link
          href="/User/Home"
          className="mr-12 font-serif text-3xl font-normal text-[#63e86f]"
        >
          Emerald Cinema
        </Link>

        <div className="flex items-center gap-10 text-sm font-medium text-gray-200">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[#63e86f]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <a
          href="/User/Profile"
          aria-label="Profile"
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#63e86f] text-sm text-[#63e86f] transition hover:bg-[#63e86f] hover:text-[#06160a]"
        >
          ◎
        </a>
      </nav>

      <section className="relative overflow-hidden pt-[72px]">
        <div className="relative h-[520px] overflow-hidden md:h-[620px]">
          <img
            src="/image/Whispers in the Woods.png"
            alt="IMAX Exclusive Promotion"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#06160a]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06160a]/95 via-[#06160a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06160a] via-[#06160a]/20 to-transparent" />

          <div className="relative z-10 flex h-full items-center px-8 md:px-14 lg:px-16">
            <div className="max-w-[720px]">
              <span className="mb-5 inline-flex rounded-full bg-[#f1cf44] px-4 py-1.5 text-[11px] font-black uppercase tracking-wide text-[#06160a]">
                Exclusive Offer
              </span>
              <h1 className="text-[52px] font-black leading-[1] text-white md:text-[76px] lg:text-[86px]">
                IMAX
                <br />
                Exclusive:
                <br />
                Buy 1 Get 1
                <br />
                Free
              </h1>
              <p className="mt-6 max-w-[680px] text-base font-bold leading-7 text-white md:text-lg">
                สัมผัสประสบการณ์ดูหนังระดับพรีเมียมที่ Emerald Cinema
                ซื้อบัตรภาพยนตร์ IMAX 1 ที่นั่ง รับฟรีอีก 1 ที่นั่ง
                สำหรับรอบที่ร่วมรายการ
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-8 pb-20 pt-16 md:px-12 lg:px-14">
        <div className="mb-9 flex items-end justify-between gap-5">
          <div>
            <h2 className="text-[38px] font-black leading-tight text-white md:text-[50px]">
              โปรโมชั่นสุดคุ้ม
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#d4e9d2] md:text-base">
              โปรโมชั่นพิเศษและประสบการณ์พิเศษเฉพาะสมาชิก
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] bg-[#273028] px-7 py-6 text-sm font-semibold text-[#d4e9d2]">
            กำลังโหลดโปรโมชั่น...
          </div>
        ) : error ? (
          <div className="rounded-[28px] bg-[#273028] px-7 py-6 text-sm font-semibold text-red-200">
            {error}
          </div>
        ) : promotionCards.length === 0 ? (
          <div className="rounded-[28px] bg-[#273028] px-7 py-6 text-sm font-semibold text-[#d4e9d2]">
            ยังไม่มีโปรโมชั่นที่ใช้งานอยู่ในขณะนี้
          </div>
        ) : (
          <div className="grid gap-9 sm:grid-cols-2 xl:grid-cols-3">
            {promotionCards.map((promotion) => (
              <article
                key={promotion.PromotionID}
                className="overflow-hidden rounded-[28px] bg-[#273028] shadow-xl shadow-black/25 transition duration-300 hover:-translate-y-1 hover:bg-[#334235]"
              >
                <div className="relative h-[260px] overflow-hidden bg-black">
                  <img
                    src={promotion.image}
                    alt={promotion.PromotionName}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-[#f1cf44] px-4 py-1.5 text-[11px] font-black uppercase tracking-wide text-[#06160a]">
                    {promotion.badge}
                  </span>
                </div>

                <div className="min-h-[190px] px-7 py-6">
                  <h3 className="text-[21px] font-black leading-tight text-white">
                    {promotion.PromotionName}
                  </h3>
                  <p className="mt-4 line-clamp-4 text-[15px] font-semibold leading-7 text-[#d4e9d2]">
                    {promotion.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
