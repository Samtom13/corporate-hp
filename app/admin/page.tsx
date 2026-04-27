import Link from "next/link";
import { getTours, getBookings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const tours = getTours();
  const bookings = getBookings();
  const newBookings = bookings.filter((b) => b.status === "new");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          Dashboard
        </h1>
        <p className="text-stone-400 text-sm mt-1">Bond Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Listings", value: tours.length, href: "/admin/listings" },
          { label: "Total Bookings", value: bookings.length, href: "/admin/bookings" },
          { label: "New Requests", value: newBookings.length, href: "/admin/bookings", highlight: newBookings.length > 0 },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`bg-white p-6 border hover:shadow-sm transition-shadow ${stat.highlight ? "border-[#016812]" : "border-stone-100"}`}
          >
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">{stat.label}</p>
            <p className={`text-4xl font-light ${stat.highlight ? "text-[#016812]" : "text-[#1A1A1A]"}`}
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white border border-stone-100 mb-6">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-sm font-medium text-[#1A1A1A]">Recent Booking Requests</h2>
          <Link href="/admin/bookings" className="text-xs text-[#016812] hover:underline">View all</Link>
        </div>
        {bookings.length === 0 ? (
          <p className="px-6 py-8 text-stone-400 text-sm text-center">No booking requests yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                {["Name", "Email", "Tour", "Date", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs tracking-widest uppercase text-stone-400 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-[#1A1A1A]">
                    <Link href={`/admin/bookings/${b.id}`} className="hover:text-[#016812]">{b.name}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">{b.email}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">{b.selectedTour || "—"}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">{b.date || "—"}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-green-100 text-green-800",
    contacted: "bg-blue-100 text-blue-800",
    confirmed: "bg-purple-100 text-purple-800",
    cancelled: "bg-stone-100 text-stone-500",
  };
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${map[status] ?? "bg-stone-100 text-stone-500"}`}>
      {status}
    </span>
  );
}
