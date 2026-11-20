"use client";
import { useState } from "react";
import type { Faq } from "@/lib/db";
import { toSlug } from "@/lib/markdown";

const INPUT =
  "w-full border-b border-stone-200 bg-transparent py-2.5 text-sm text-[#1A1A1A] font-light focus:outline-none focus:border-[#016812] transition-colors";

export default function FaqManager({ initial }: { initial: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dirty = JSON.stringify(faqs) !== JSON.stringify(initial);

  const set = (i: number, patch: Partial<Faq>) =>
    setFaqs((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  const move = (i: number, dir: -1 | 1) =>
    setFaqs((prev) => {
      const next = [...prev];
      const target = i + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });

  const add = () =>
    setFaqs((prev) => [...prev, { id: `faq-${Date.now()}`, question: "", answer: "" }]);

  const remove = (i: number) => setFaqs((prev) => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = faqs.map((f) => ({
        ...f,
        id: f.id || toSlug(f.question) || `faq-${Date.now()}`,
      }));
      const res = await fetch("/api/admin/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setFaqs(payload);
      setMessage(`Saved — ${data.count} questions are live on /faq.`);
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
            FAQ
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            These questions appear on{" "}
            <a href="/faq" target="_blank" rel="noopener noreferrer" className="text-[#016812] hover:underline">
              /faq
            </a>{" "}
            and are sent to Google and AI assistants as FAQ structured data.
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

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={faq.id || i} className="bg-white border border-stone-100 p-6">
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
                  disabled={i === faqs.length - 1}
                  className="text-stone-300 hover:text-[#016812] disabled:opacity-30 text-xs"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>
              <div className="flex-1 space-y-3">
                <input
                  className={INPUT}
                  value={faq.question}
                  onChange={(e) => set(i, { question: e.target.value })}
                  placeholder="Question — write it the way a guest would ask it"
                />
                <textarea
                  className={`${INPUT} resize-y`}
                  rows={3}
                  value={faq.answer}
                  onChange={(e) => set(i, { answer: e.target.value })}
                  placeholder="Answer — be specific. Numbers, prices and place names get quoted by AI assistants."
                />
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
        + Add question
      </button>
    </div>
  );
}
