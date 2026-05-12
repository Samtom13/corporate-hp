import Link from "next/link";
import { getBookings } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-green-100 text-green-800",
  contacted: "bg-blue-100 text-blue-800",
  confirmed: "bg-purple-100 text-purple-800",
  cancelled: "bg-stone-100 text-stone-500",
};

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Booking Requests
        </h1>
        <p className="text-stone-400 text-sm mt-1">{bookings.length} total requests</p>
      </div>

      <div className="bg-white border border-stone-100">
        {bookings.length === 0 ? (
          <p className="px-6 py-16 text-stone-400 text-sm text-center">No booking requests yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                {["Date", "Name", "Email", "Tour", "Guests", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs tracking-widest uppercase text-stone-400 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 text-xs text-stone-400 whitespace-nowrap">
                    {new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1A1A1A]">
                    <Link href={`/admin/bookings/${b.id}`} className="hover:text-[#016812]">{b.name}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">{b.email}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">{b.selectedTour || "—"}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">{b.guests}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${STATUS_COLORS[b.status] ?? "bg-stone-100 text-stone-500"}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
