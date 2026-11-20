"use client";
import { useState } from "react";
import type { Review, SiteSettings } from "@/lib/db";
import { toSlug } from "@/lib/markdown";

const INPUT =
  "w-full border-b border-stone-200 bg-transparent py-2.5 text-sm text-[#1A1A1A] font-light focus:outline-none focus:border-[#016812] transition-colors";
const LABEL = "block text-xs tracking-widest uppercase text-stone-400 mb-2";

const PLATFORMS = ["Klook", "GetYourGuide", "Viator", "TripAdvisor", "Airbnb", "Google", "Direct"];

export default function ReviewManager({
  initial,
  initialSettings,
}: {
  initial: Review[];
  initialSettings: SiteSettings;
}) {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dirty =
    JSON.stringify(reviews) !== JSON.stringify(initial) ||
    JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const featuredCount = reviews.filter((r) => r.featured).length;

  const set = (i: number, patch: Partial<Review>) =>
    setReviews((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const move = (i: number, dir: -1 | 1) =>
    setReviews((prev) => {
      const next = [...prev];
      const target = i + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });

  const add = () =>
    setReviews((prev) => [
      {
        id: `review-${Date.now()}`,
        name: "",
        country: "",
        platform: "Klook",
        text: "",
        rating: 5,
        featured: true,
      },
      ...prev,
    ]);

  const remove = (i: number) => setReviews((prev) => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = reviews.map((r) => ({
        ...r,
        id: r.id || toSlug(r.name) || `review-${Date.now()}`,
      }));
      const [res, settingsRes] = await Promise.all([
        fetch("/api/admin/reviews", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }),
      ]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      if (!settingsRes.ok) throw new Error("Rating settings could not be saved");
      setReviews(payload);
      setMessage(`Saved — ${data.count} reviews stored, ${featuredCount} shown on the homepage.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-8 gap-6">
        <div>
          <h1
            className="text-2xl font-light text-[#1A1A1A]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Reviews
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Featured reviews appear in &ldquo;Guest stories&rdquo; on the homepage and are sent to
            Google as Review structured data.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving || !dirty}
          className="flex-shrink-0 px-6 py-3 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors disabled:opacity-40"
        >
          {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
        </button>
      </div>

      {error && (
        <p className="mb-6 bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3">{error}</p>
      )}
      {message && (
        <p className="mb-6 bg-green-50 border border-green-100 text-green-700 text-sm px-4 py-3">
          {message}
        </p>
      )}

      {/* Aggregate rating */}
      <div className="bg-white border border-stone-100 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={LABEL}>Average rating across OTAs</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="5"
            className={INPUT}
            value={settings.reviewRating}
            onChange={(e) =>
              setSettings((s) => ({ ...s, reviewRating: Number(e.target.value) }))
            }
          />
        </div>
        <div>
          <label className={LABEL}>Total review count</label>
          <input
            type="number"
            min="0"
            className={INPUT}
            value={settings.reviewCount}
            onChange={(e) => setSettings((s) => ({ ...s, reviewCount: Number(e.target.value) }))}
          />
        </div>
      </div>

      <p className="text-xs text-stone-400 mb-4">
        {reviews.length} reviews · {featuredCount} featured on the homepage
      </p>

      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div key={review.id || i} className="bg-white border border-stone-100 p-6">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 pt-2">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-stone-300 hover:text-[#016812] disabled:opacity-30 text-xs"
                  aria-label="Move up"
                >
                  ▲
                </button>
                <span className="text-xs text-stone-300">{i + 1}</span>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === reviews.length - 1}
                  className="text-stone-300 hover:text-[#016812] disabled:opacity-30 text-xs"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <input
                    className={INPUT}
                    value={review.name}
                    onChange={(e) => set(i, { name: e.target.value })}
                    placeholder="Guest name"
                  />
                  <input
                    className={INPUT}
                    value={review.country}
                    onChange={(e) => set(i, { country: e.target.value })}
                    placeholder="Country"
                  />
                  <select
                    className={INPUT}
                    value={review.platform}
                    onChange={(e) => set(i, { platform: e.target.value })}
                  >
                    {[...new Set([...PLATFORMS, review.platform].filter(Boolean))].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <select
                    className={INPUT}
                    value={review.rating}
                    onChange={(e) => set(i, { rating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} ★
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  className={`${INPUT} resize-y`}
                  rows={4}
                  value={review.text}
                  onChange={(e) => set(i, { text: e.target.value })}
                  placeholder="Review text — paste it exactly as the guest wrote it"
                />
                <label className="flex items-center gap-2 text-xs text-stone-500">
                  <input
                    type="checkbox"
                    checked={review.featured}
                    onChange={(e) => set(i, { featured: e.target.checked })}
                    className="accent-[#016812]"
                  />
                  Show on homepage
                </label>
              </div>
              <button
                onClick={() => remove(i)}
                className="text-stone-300 hover:text-red-400 text-lg leading-none pt-2"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={add} className="mt-6 text-xs text-[#016812] hover:underline">
        + Add review
      </button>
    </div>
  );
}
