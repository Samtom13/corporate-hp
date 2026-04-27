"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Tour } from "@/lib/db";

type Props = {
  initial: Partial<Tour>;
  isNew?: boolean;
};

const TAGS = ["Culture", "Nature", "Food", "Tradition", "History", "Art"];

function toId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ListingEditor({ initial, isNew }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const [tour, setTour] = useState<Tour>({
    id: initial.id ?? "",
    title: initial.title ?? "",
    subtitle: initial.subtitle ?? "",
    tag: initial.tag ?? "Culture",
    duration: initial.duration ?? "",
    groupSize: initial.groupSize ?? "",
    priceFrom: initial.priceFrom ?? "",
    description: initial.description ?? "",
    highlights: initial.highlights ?? [""],
    itinerary: initial.itinerary ?? [{ time: "", activity: "" }],
    images: initial.images ?? ["", "", ""],
  });

  const set = (key: keyof Tour, value: unknown) =>
    setTour((prev) => ({ ...prev, [key]: value }));

  // Highlights
  const setHighlight = (i: number, v: string) => {
    const arr = [...tour.highlights];
    arr[i] = v;
    set("highlights", arr);
  };
  const addHighlight = () => set("highlights", [...tour.highlights, ""]);
  const removeHighlight = (i: number) =>
    set("highlights", tour.highlights.filter((_, idx) => idx !== i));

  // Itinerary
  const setItinerary = (i: number, field: "time" | "activity", v: string) => {
    const arr = [...tour.itinerary];
    arr[i] = { ...arr[i], [field]: v };
    set("itinerary", arr);
  };
  const addItinerary = () => set("itinerary", [...tour.itinerary, { time: "", activity: "" }]);
  const removeItinerary = (i: number) =>
    set("itinerary", tour.itinerary.filter((_, idx) => idx !== i));

  const handleImageUpload = (i: number, file: File) => {
    setUploadingIdx(i);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(i, e.target?.result as string);
      setUploadingIdx(null);
    };
    reader.readAsDataURL(file);
  };

  // Images
  const setImage = (i: number, v: string) => {
    const arr = [...tour.images];
    arr[i] = v;
    set("images", arr);
  };
  const addImage = () => set("images", [...tour.images, ""]);
  const removeImage = (i: number) =>
    set("images", tour.images.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const id = isNew ? toId(tour.title) : tour.id;
    const payload = {
      ...tour,
      id,
      highlights: tour.highlights.filter(Boolean),
      itinerary: tour.itinerary.filter((r) => r.activity),
      images: tour.images.filter(Boolean),
    };
    const res = await fetch(
      isNew ? "/api/admin/listings" : `/api/admin/listings/${id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (res.ok) {
      router.push("/admin/listings");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Save failed.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${tour.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/admin/listings/${tour.id}`, { method: "DELETE" });
    router.push("/admin/listings");
    router.refresh();
  };

  const field = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-xs tracking-widest uppercase text-stone-400 mb-2">{label}</label>
      {children}
    </div>
  );

  const inputClass = "w-full border-b border-stone-200 bg-transparent py-2.5 text-sm text-[#1A1A1A] font-light focus:outline-none focus:border-[#016812] transition-colors";
  const textareaClass = "w-full border border-stone-200 bg-transparent p-3 text-sm text-[#1A1A1A] font-light focus:outline-none focus:border-[#016812] transition-colors resize-none";

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {isNew ? "New Listing" : `Edit: ${initial.title}`}
        </h1>
        <div className="flex gap-3">
          {!isNew && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 border border-red-200 text-red-400 text-xs tracking-widest uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-6">{error}</p>}

      <div className="space-y-8">
        {/* Basic info */}
        <div className="bg-white border border-stone-100 p-6 space-y-6">
          <h2 className="text-xs tracking-widest uppercase text-stone-400 border-b border-stone-100 pb-3">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {field("Title *", <input className={inputClass} value={tour.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Hidden Kyoto" required />)}
            {field("Subtitle", <input className={inputClass} value={tour.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="e.g. Alleyways & Artisans" />)}
            {field("Tag", (
              <select className={inputClass} value={tour.tag} onChange={(e) => set("tag", e.target.value)}>
                {TAGS.map((t) => <option key={t}>{t}</option>)}
              </select>
            ))}
            {field("Duration", <input className={inputClass} value={tour.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. Full day (7–8 hours)" />)}
            {field("Group Size", <input className={inputClass} value={tour.groupSize} onChange={(e) => set("groupSize", e.target.value)} placeholder="e.g. 1–4 guests" />)}
            {field("Price From", <input className={inputClass} value={tour.priceFrom} onChange={(e) => set("priceFrom", e.target.value)} placeholder="e.g. From ¥45,000 per group" />)}
          </div>
          {field("Description", <textarea className={textareaClass} rows={4} value={tour.description} onChange={(e) => set("description", e.target.value)} placeholder="Main description shown on the tour page." />)}
        </div>

        {/* Images */}
        <div className="bg-white border border-stone-100 p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-stone-400 border-b border-stone-100 pb-3">Photos</h2>
          <p className="text-xs text-stone-400">最初の画像がメイン表示されます。ファイルをアップロードするかURLを入力してください。</p>
          {tour.images.map((img, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div
                className="w-16 h-12 flex-shrink-0 border border-stone-200 flex items-center justify-center cursor-pointer hover:border-[#016812] transition-colors relative overflow-hidden"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleImageUpload(i, file);
                  };
                  input.click();
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleImageUpload(i, file);
                }}
              >
                {uploadingIdx === i ? (
                  <span className="text-xs text-stone-400">...</span>
                ) : img ? (
                  <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <span className="text-stone-300 text-xs text-center leading-tight">↑<br/>Upload</span>
                )}
              </div>
              <input
                className={`${inputClass} flex-1`}
                value={img}
                onChange={(e) => setImage(i, e.target.value)}
                placeholder={`Image ${i + 1} URL（またはファイルをアップロード）`}
              />
              <button onClick={() => removeImage(i)} className="text-stone-300 hover:text-red-400 text-lg leading-none mt-2">×</button>
            </div>
          ))}
          <button onClick={addImage} className="text-xs text-[#016812] hover:underline">+ Add image</button>
        </div>

        {/* Highlights */}
        <div className="bg-white border border-stone-100 p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-stone-400 border-b border-stone-100 pb-3">Experience Highlights</h2>
          {tour.highlights.map((h, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input className={`${inputClass} flex-1`} value={h} onChange={(e) => setHighlight(i, e.target.value)} placeholder={`Highlight ${i + 1}`} />
              <button onClick={() => removeHighlight(i)} className="text-stone-300 hover:text-red-400 text-lg leading-none">×</button>
            </div>
          ))}
          <button onClick={addHighlight} className="text-xs text-[#016812] hover:underline">+ Add highlight</button>
        </div>

        {/* Itinerary */}
        <div className="bg-white border border-stone-100 p-6 space-y-4">
          <h2 className="text-xs tracking-widest uppercase text-stone-400 border-b border-stone-100 pb-3">Sample Itinerary</h2>
          {tour.itinerary.map((row, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                className={`${inputClass} w-20 flex-shrink-0`}
                value={row.time}
                onChange={(e) => setItinerary(i, "time", e.target.value)}
                placeholder="09:00"
              />
              <input
                className={`${inputClass} flex-1`}
                value={row.activity}
                onChange={(e) => setItinerary(i, "activity", e.target.value)}
                placeholder="Activity description"
              />
              <button onClick={() => removeItinerary(i)} className="text-stone-300 hover:text-red-400 text-lg leading-none">×</button>
            </div>
          ))}
          <button onClick={addItinerary} className="text-xs text-[#016812] hover:underline">+ Add step</button>
        </div>

        {/* Preview link */}
        {!isNew && (
          <div className="text-right">
            <a
              href={`/tour/${tour.id}`}
              target="_blank"
              className="text-xs text-stone-400 hover:text-[#016812] transition-colors"
            >
              Preview public page ↗
            </a>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-10 py-3 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}
