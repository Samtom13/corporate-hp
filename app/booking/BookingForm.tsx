"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Tour } from "@/lib/db";

const interests = [
  { value: "food", label: "Food & Drink" },
  { value: "culture", label: "Culture & Arts" },
  { value: "nature", label: "Nature & Outdoors" },
  { value: "local", label: "Local Interaction" },
  { value: "history", label: "History & Temples" },
  { value: "crafts", label: "Traditional Crafts" },
];

function FormInner({ tours }: { tours: Pick<Tour, "id" | "title" | "subtitle">[] }) {
  const searchParams = useSearchParams();
  const tourParam = searchParams.get("tour") ?? "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    guests: "2",
    date: "",
    flexibleDates: false,
    selectedTour: tourParam,
    selectedInterests: [] as string[],
    requests: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const toggleInterest = (value: string) => {
    setForm((prev) => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(value)
        ? prev.selectedInterests.filter((i) => i !== value)
        : [...prev.selectedInterests, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 rounded-full border border-[#016812] flex items-center justify-center mx-auto mb-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#016812" strokeWidth="1.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-4">Request Received</p>
          <h2
            className="text-4xl font-light text-[#1A1A1A] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            We received your request.
          </h2>
          <p className="text-stone-500 font-light leading-relaxed mb-4">
            Thank you for reaching out. We are reviewing your request and will be in touch shortly.
          </p>
          <p className="text-stone-500 font-light leading-relaxed mb-10">
            We&apos;ll help you create a personalized and unforgettable experience in Kyoto.
          </p>
          <p className="text-sm text-stone-400 mb-10 italic" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            — Bond Team
          </p>
          <Link
            href="/"
            className="text-xs tracking-widest uppercase border-b border-[#1A1A1A] pb-1 hover:border-[#016812] hover:text-[#016812] transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Tour selection — from live DB */}
      <div>
        <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
          Experience (optional)
        </label>
        <select
          value={form.selectedTour}
          onChange={(e) => setForm({ ...form, selectedTour: e.target.value })}
          className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-[#1A1A1A] font-light focus:outline-none focus:border-[#016812] transition-colors"
        >
          <option value="">I&apos;d like to discuss / not sure yet</option>
          {tours.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}{t.subtitle ? ` — ${t.subtitle}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
            Full Name <span className="text-[#016812]">*</span>
          </label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-[#1A1A1A] font-light placeholder-stone-300 focus:outline-none focus:border-[#016812] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
            Email Address <span className="text-[#016812]">*</span>
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com"
            className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-[#1A1A1A] font-light placeholder-stone-300 focus:outline-none focus:border-[#016812] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
            WhatsApp <span className="text-[#016812]">*</span>
          </label>
          <input
            required
            type="tel"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="+81 90-1234-5678"
            className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-[#1A1A1A] font-light placeholder-stone-300 focus:outline-none focus:border-[#016812] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
            Number of Guests <span className="text-[#016812]">*</span>
          </label>
          <select
            required
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-[#1A1A1A] font-light focus:outline-none focus:border-[#016812] transition-colors"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={String(n)}>{n} {n === 1 ? "guest" : "guests"}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
          Preferred Date
        </label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full border-b border-stone-200 bg-transparent py-3 text-sm text-[#1A1A1A] font-light focus:outline-none focus:border-[#016812] transition-colors"
        />
        <label className="flex items-center gap-3 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={form.flexibleDates}
            onChange={(e) => setForm({ ...form, flexibleDates: e.target.checked })}
            className="w-4 h-4 border border-stone-300 accent-[#016812]"
          />
          <span className="text-xs text-stone-500 font-light">My dates are flexible</span>
        </label>
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-stone-400 mb-4">
          What are you interested in?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {interests.map((interest) => {
            const selected = form.selectedInterests.includes(interest.value);
            return (
              <button
                type="button"
                key={interest.value}
                onClick={() => toggleInterest(interest.value)}
                className={`py-3 px-4 border text-xs tracking-wide transition-all duration-200 text-left ${
                  selected
                    ? "border-[#016812] bg-[#016812] text-white"
                    : "border-stone-200 text-stone-500 hover:border-stone-400"
                }`}
              >
                {interest.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
          Special Requests or Notes
        </label>
        <textarea
          value={form.requests}
          onChange={(e) => setForm({ ...form, requests: e.target.value })}
          rows={5}
          placeholder="Tell us about dietary requirements, physical limitations, special occasions, or anything that would help us create the perfect experience for you."
          className="w-full border border-stone-200 bg-transparent p-4 text-sm text-[#1A1A1A] font-light placeholder-stone-300 focus:outline-none focus:border-[#016812] transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm font-light">
          {errorMsg || "Something went wrong. Please email us at"}{" "}
          {!errorMsg && <a href="mailto:info@go-bond.jp" className="underline">info@go-bond.jp</a>}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-5 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending..." : "Send Request"}
      </button>

      <p className="text-center text-xs text-stone-400 font-light">
        No payment required. We&apos;ll get back to you within 24 hours.
      </p>
    </form>
  );
}

export default function BookingForm({ tours }: { tours: Pick<Tour, "id" | "title" | "subtitle">[] }) {
  return (
    <Suspense>
      <FormInner tours={tours} />
    </Suspense>
  );
}
