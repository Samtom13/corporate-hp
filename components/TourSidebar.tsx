"use client";
import { useState } from "react";
import Link from "next/link";
import type { Tour } from "@/lib/db";

type Props = {
  tour: Pick<Tour, "id" | "duration" | "groupSize" | "priceFrom" | "pricing">;
};

export default function TourSidebar({ tour }: Props) {
  const hasPricing = tour.pricing && tour.pricing.length > 0;
  const sorted = hasPricing
    ? [...tour.pricing].sort((a, b) => a.guests - b.guests)
    : [];

  // Start with null so no price is shown until the user selects
  const [selectedGuests, setSelectedGuests] = useState<number | null>(null);

  const selectedPrice =
    selectedGuests !== null
      ? (sorted.find((p) => p.guests === selectedGuests)?.price ?? null)
      : null;

  // "From" label: use priceFrom text, or derive from cheapest tier
  const fromLabel = tour.priceFrom
    ? tour.priceFrom
    : sorted.length > 0
    ? `From ¥${sorted[0].price.toLocaleString()} per person`
    : null;

  return (
    <div className="sticky top-28 bg-[#F5F4F2] p-8 space-y-6">

      {/* From price — always shown at top if available */}
      {fromLabel && (
        <div className="border-b border-stone-200 pb-5">
          <p className="text-xs text-stone-400 mb-1">From</p>
          <p className="text-2xl font-light text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {fromLabel}
          </p>
        </div>
      )}

      <div>
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Duration</p>
        <p className="text-sm text-[#1A1A1A] font-light">{tour.duration}</p>
      </div>
      <div>
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Group size</p>
        <p className="text-sm text-[#1A1A1A] font-light">{tour.groupSize}</p>
      </div>

      {/* Pricing */}
      {hasPricing && (
        <div>
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Number of guests</p>
          {/* Select with visible ▼ arrow */}
          <div className="relative">
            <select
              value={selectedGuests ?? ""}
              onChange={(e) =>
                setSelectedGuests(e.target.value === "" ? null : Number(e.target.value))
              }
              className="w-full border-b border-stone-300 bg-transparent py-2 pr-7 text-sm text-[#1A1A1A] font-light focus:outline-none focus:border-[#016812] transition-colors cursor-pointer appearance-none"
            >
              <option value="">— Select guests —</option>
              {sorted.map((p) => (
                <option key={p.guests} value={p.guests}>
                  {p.guests} {p.guests === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-stone-400 text-xs">▼</span>
          </div>

          {/* Price — only shown after guest selection */}
          {selectedPrice !== null && (
            <div className="mt-4">
              <p className="text-2xl font-light text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                ¥{selectedPrice.toLocaleString()}
              </p>
              <p className="text-xs text-stone-400 mt-1">per person</p>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-stone-200 pt-6">
        <p className="text-xs text-stone-400 leading-relaxed mb-6">
          No payment required. We&apos;ll design your personalized experience and confirm all details first.
        </p>
        <Link
          href={`/booking?tour=${tour.id}${selectedGuests ? `&guests=${selectedGuests}` : ""}`}
          className="block w-full text-center py-4 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors duration-300"
        >
          Request This Experience
        </Link>
      </div>
      <div className="border-t border-stone-200 pt-6">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Questions?</p>
        <a
          href="mailto:info@go-bond.jp"
          className="text-sm text-[#1A1A1A] hover:text-[#016812] transition-colors font-light"
        >
          info@go-bond.jp →
        </a>
      </div>
    </div>
  );
}
