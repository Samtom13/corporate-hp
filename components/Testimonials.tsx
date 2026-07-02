"use client";
import { useState } from "react";

export type Review = {
  name: string;
  country: string;
  platform: string;
  text: string;
};

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 220;

  return (
    <div className="bg-white p-8 flex flex-col">
      <p
        className="text-4xl text-[#016812]/20 mb-4 leading-none"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        &ldquo;
      </p>
      <p
        className={`text-stone-600 font-light leading-relaxed italic mb-3 text-sm ${
          isLong && !expanded ? "line-clamp-5" : ""
        }`}
      >
        {review.text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="self-start text-xs tracking-widest uppercase text-[#016812] hover:text-[#014010] transition-colors mb-6"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
      <div className="mt-auto pt-4">
        <p className="text-sm font-medium text-[#1A1A1A]">{review.name}</p>
        <p className="text-xs text-stone-400 mt-1">
          {review.country} · via {review.platform}
        </p>
      </div>
    </div>
  );
}

export default function Testimonials({
  reviews,
  rating,
  count,
}: {
  reviews: Review[];
  rating: number;
  count: number;
}) {
  return (
    <section className="py-28 px-6 bg-[#F5F4F2]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-4">
            Guest stories
          </p>
          <h2
            className="text-4xl md:text-5xl font-light text-[#1A1A1A] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            What our guests say.
          </h2>
          <p className="text-stone-500 font-light">
            <span className="text-[#016812] font-medium">
              {rating.toFixed(1)} ★
            </span>{" "}
            average from {count}+ reviews across Klook, GetYourGuide &amp; Viator
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
