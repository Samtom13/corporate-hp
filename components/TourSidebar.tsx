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

  const [selectedGuests, setSelectedGuests] = useState<number | null>(
    sorted.length > 0 ? sorted[0].guests : null
  );

  const selectedPrice = sorted.find((p) => p.guests === selectedGuests)?.price ?? null;

  return (
    <div className="sticky top-28 bg-[#F5F4F2] p-8 space-y-6">
      <div>
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Duration</p>
        <p className="text-sm text-[#1A1A1A] font-light">{tour.duration}</p>
      </div>
      <div>
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Group size</p>
        <p className="text-sm text-[#1A1A1A] font-light">{tour.groupSize}</p>
      </div>

      {/* Pricing */}
      <div>
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Pricing</p>
        {hasPricing ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-stone-400 mb-1.5 block">Number of guests</label>
              <select
                value={selectedGuests ?? ""}
                onChange={(e) => setSelectedGuests(Number(e.target.value))}
                className="w-full border-b border-stone-300 bg-transparent py-2 text-sm text-[#1A1A1A] font-light focus:outline-none focus:border-[#016812] transition-colors cursor-pointer appearance-none"
              >
                {sorted.map((p) => (
                  <option key={p.guests} value={p.guests}>
                    {p.guests} {p.guests === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </div>
            {selectedPrice !== null && (
              <div className="pt-1">
                <p className="text-2xl font-light text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  ¥{selectedPrice.toLocaleString()}
                </p>
                <p className="text-xs text-stone-400 mt-1">per group · exact price confirmed after request</p>
              </div>
            )}
          </div>
        ) : tour.priceFrom ? (
          <div>
            <p className="text-sm text-[#1A1A1A] font-light">{tour.priceFrom}</p>
            <p className="text-xs text-stone-400 mt-1">Exact price confirmed after your request.</p>
          </div>
        ) : null}
      </div>

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
