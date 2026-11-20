"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Article, ArticleFaq } from "@/lib/db";
import { renderMarkdown, toSlug } from "@/lib/markdown";

const INPUT =
  "w-full border-b border-stone-200 bg-transparent py-2.5 text-sm text-[#1A1A1A] font-light focus:outline-none focus:border-[#016812] transition-colors";
const LABEL = "block text-xs tracking-widest uppercase text-stone-400 mb-2";
const CARD = "bg-white border border-stone-100 p-6 space-y-5";

const BODY_PLACEHOLDER = `## Start with the question a traveler would actually ask

Write a short, direct answer in the first paragraph — that is the part AI
assistants quote.

- Use bullet points for concrete facts (prices, durations, access)
- Keep paragraphs short
- Link to the relevant tour: [Full-day Kyoto highlights](/tour/kyoto-highlights)

### Sub-heading for the next question

More detail here.`;

export default function ArticleEditor({
  initial,
  isNew,
}: {
  initial: Partial<Article>;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [slugLocked, setSlugLocked] = useState(!isNew);

  const today = new Date().toISOString().slice(0, 10);

  const [article, setArticle] = useState<Article>({
    id: initial.id ?? "",
    title: initial.title ?? "",
    excerpt: initial.excerpt ?? "",
    body: initial.body ?? "",
    coverImage: initial.coverImage ?? "",
    author: initial.author ?? "Bond",
    publishedAt: initial.publishedAt ?? today,
    updatedAt: initial.updatedAt ?? today,
    tags: initial.tags ?? [],
    status: initial.status ?? "draft",
    metaTitle: initial.metaTitle ?? "",
    metaDescription: initial.metaDescription ?? "",
    faqs: initial.faqs ?? [],
  });

  const set = <K extends keyof Article>(key: K, value: Article[K]) =>
    setArticle((prev) => ({ ...prev, [key]: value }));

  const onTitleChange = (value: string) => {
    setArticle((prev) => ({
      ...prev,
      title: value,
      id: slugLocked ? prev.id : toSlug(value),
    }));
  };

  const setFaq = (i: number, patch: Partial<ArticleFaq>) =>
    setArticle((prev) => ({
      ...prev,
      faqs: prev.faqs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)),
    }));

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      set("coverImage", data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (status?: Article["status"]) => {
    const next = status ? { ...article, status } : article;
    if (!next.title.trim()) return setError("Title is required.");
    if (!next.id.trim()) return setError("URL slug is required.");
    if (next.status === "published" && !next.excerpt.trim()) {
      return setError("A summary is required before publishing (it is used as the meta description).");
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch(
        isNew ? "/api/admin/articles" : `/api/admin/articles/${initial.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...next,
            id: toSlug(next.id),
            tags: next.tags.map((t) => t.trim()).filter(Boolean),
            faqs: next.faqs.filter((f) => f.question.trim() && f.answer.trim()),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/articles");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${initial.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/articles");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-6">
        <div>
          <Link href="/admin/articles" className="text-xs text-stone-400 hover:text-[#016812]">
            ← Articles
          </Link>
          <h1
            className="text-2xl font-light text-[#1A1A1A] mt-2"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {isNew ? "New article" : article.title || "Untitled"}
          </h1>
          {!isNew && (
            <a
              href={`/blog/${article.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#016812] hover:underline"
            >
              /blog/{article.id} ↗
            </a>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span
            className={`px-2 py-1 text-xs rounded ${
              article.status === "published"
                ? "bg-green-100 text-green-800"
                : "bg-stone-100 text-stone-500"
            }`}
          >
            {article.status}
          </span>
          <button
            onClick={() => save("draft")}
            disabled={saving || deleting}
            className="px-5 py-3 border border-stone-200 text-xs tracking-widest uppercase text-stone-500 hover:border-stone-400 transition-colors disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving || deleting}
            className="px-6 py-3 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-6 bg-red-50 border border-red-100 text-red-500 text-sm px-4 py-3">{error}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <div className={CARD}>
            <div>
              <label className={LABEL}>Title</label>
              <input
                className={INPUT}
                value={article.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Best time to visit Kyoto for autumn leaves"
              />
            </div>
            <div>
              <label className={LABEL}>URL slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">/blog/</span>
                <input
                  className={INPUT}
                  value={article.id}
                  onChange={(e) => {
                    setSlugLocked(true);
                    set("id", e.target.value);
                  }}
                  placeholder="best-time-to-visit-kyoto-autumn"
                />
              </div>
            </div>
            <div>
              <label className={LABEL}>Summary — used as the meta description</label>
              <textarea
                className={`${INPUT} resize-y`}
                rows={3}
                value={article.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="One or two sentences answering the question this article is about. 120–160 characters works best in search results."
              />
              <p className="text-xs text-stone-400 mt-1">{article.excerpt.length} characters</p>
            </div>
          </div>

          <div className={CARD}>
            <div className="flex items-center justify-between">
              <label className={`${LABEL} mb-0`}>Body — Markdown</label>
              <button
                onClick={() => setPreview((v) => !v)}
                className="text-xs text-[#016812] hover:underline"
              >
                {preview ? "Edit" : "Preview"}
              </button>
            </div>
            {preview ? (
              <div
                className="article-body text-sm"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }}
              />
            ) : (
              <textarea
                className="w-full border border-stone-200 bg-transparent p-4 text-sm text-[#1A1A1A] font-light leading-relaxed focus:outline-none focus:border-[#016812] transition-colors font-mono resize-y"
                rows={24}
                value={article.body}
                onChange={(e) => set("body", e.target.value)}
                placeholder={BODY_PLACEHOLDER}
              />
            )}
            <p className="text-xs text-stone-400">
              ## heading · ### sub-heading · - bullet · **bold** · [text](/url) ·
              ![alt](image-url) · &gt; quote
            </p>
          </div>

          {/* Per-article FAQ — emitted as FAQPage JSON-LD */}
          <div className={CARD}>
            <div>
              <label className={`${LABEL} mb-1`}>FAQ on this article</label>
              <p className="text-xs text-stone-400">
                Shown at the bottom of the article and sent to Google and AI assistants as
                FAQ structured data. Two to five short Q&amp;As work best.
              </p>
            </div>
            {article.faqs.map((faq, i) => (
              <div key={i} className="border-l-2 border-stone-100 pl-4 space-y-3">
                <div className="flex gap-3 items-center">
                  <input
                    className={`${INPUT} flex-1`}
                    value={faq.question}
                    onChange={(e) => setFaq(i, { question: e.target.value })}
                    placeholder="Question"
                  />
                  <button
                    onClick={() =>
                      set(
                        "faqs",
                        article.faqs.filter((_, idx) => idx !== i)
                      )
                    }
                    className="text-stone-300 hover:text-red-400 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <textarea
                  className={`${INPUT} resize-y`}
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => setFaq(i, { answer: e.target.value })}
                  placeholder="Answer"
                />
              </div>
            ))}
            <button
              onClick={() => set("faqs", [...article.faqs, { question: "", answer: "" }])}
              className="text-xs text-[#016812] hover:underline"
            >
              + Add question
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className={CARD}>
            <div>
              <label className={LABEL}>Cover image</label>
              {article.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.coverImage}
                  alt=""
                  className="w-full h-32 object-cover mb-3"
                />
              )}
              <input
                className={INPUT}
                value={article.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="https://… or upload below"
              />
              <label className="mt-3 inline-block text-xs text-[#016812] hover:underline cursor-pointer">
                {uploading ? "Uploading…" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          <div className={CARD}>
            <div>
              <label className={LABEL}>Author</label>
              <input
                className={INPUT}
                value={article.author}
                onChange={(e) => set("author", e.target.value)}
              />
            </div>
            <div>
              <label className={LABEL}>Published date</label>
              <input
                type="date"
                className={INPUT}
                value={article.publishedAt}
                onChange={(e) => set("publishedAt", e.target.value)}
              />
            </div>
            <div>
              <label className={LABEL}>Tags — comma separated</label>
              <input
                className={INPUT}
                value={article.tags.join(", ")}
                onChange={(e) => set("tags", e.target.value.split(","))}
                placeholder="Kyoto, Autumn, Planning"
              />
            </div>
          </div>

          <div className={CARD}>
            <div>
              <label className={`${LABEL} mb-1`}>SEO overrides — optional</label>
              <p className="text-xs text-stone-400 mb-3">
                Leave empty to use the title and summary above.
              </p>
              <input
                className={INPUT}
                value={article.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                placeholder="Meta title"
              />
            </div>
            <div>
              <textarea
                className={`${INPUT} resize-y`}
                rows={3}
                value={article.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                placeholder="Meta description"
              />
            </div>
          </div>

          {!isNew && (
            <button
              onClick={remove}
              disabled={deleting || saving}
              className="w-full py-3 border border-red-100 text-red-400 text-xs tracking-widest uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete article"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
