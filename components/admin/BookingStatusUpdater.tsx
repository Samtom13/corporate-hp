"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["new", "contacted", "confirmed", "cancelled"] as const;
type Status = (typeof STATUSES)[number];

const COLORS: Record<Status, string> = {
  new: "bg-green-100 text-green-800",
  contacted: "bg-blue-100 text-blue-800",
  confirmed: "bg-purple-100 text-purple-800",
  cancelled: "bg-stone-100 text-stone-500",
};

export default function BookingStatusUpdater({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleChange = async (newStatus: Status) => {
    setSaving(true);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setStatus(newStatus);
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`px-3 py-1 text-xs rounded ${COLORS[status]}`}>
        {status}
      </span>
      <select
        value={status}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value as Status)}
        className="text-xs border border-stone-200 bg-white px-3 py-2 focus:outline-none focus:border-[#016812] disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
