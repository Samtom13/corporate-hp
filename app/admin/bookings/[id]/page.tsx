import { notFound } from "next/navigation";
import Link from "next/link";
import { getBookingById } from "@/lib/db";
import BookingStatusUpdater from "@/components/admin/BookingStatusUpdater";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function BookingDetailPage({ params }: Props) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/bookings" className="text-xs text-stone-400 hover:text-[#016812] mb-2 inline-block">
            ← Bookings
          </Link>
          <h1 className="text-2xl font-light text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {booking.name}
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            {new Date(booking.createdAt).toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Asia/Tokyo",
            })}
          </p>
        </div>
        <BookingStatusUpdater id={booking.id} currentStatus={booking.status} />
      </div>

      <div className="bg-white border border-stone-100 p-6 space-y-5">
        {[
          { label: "Email", value: booking.email, href: `mailto:${booking.email}` },
          { label: "WhatsApp", value: booking.whatsapp ?? "—" },
          { label: "Guests", value: booking.guests },
          { label: "Tour", value: booking.selectedTour ?? "Not specified" },
          {
            label: "Date",
            value: booking.date
              ? `${booking.date}${booking.flexibleDates ? " (flexible)" : ""}`
              : "Not specified",
          },
          {
            label: "Interests",
            value: booking.selectedInterests?.length
              ? booking.selectedInterests.join(", ")
              : "None",
          },
        ].map((row) => (
          <div key={row.label} className="flex gap-6 border-b border-stone-50 pb-5 last:border-0 last:pb-0">
            <span className="text-xs tracking-widest uppercase text-stone-400 w-28 flex-shrink-0 pt-0.5">{row.label}</span>
            {row.href ? (
              <a href={row.href} className="text-sm text-[#016812] font-light">{row.value}</a>
            ) : (
              <span className="text-sm text-[#1A1A1A] font-light">{row.value}</span>
            )}
          </div>
        ))}

        {booking.requests && (
          <div className="border-t border-stone-100 pt-5">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Notes / Special Requests</p>
            <p className="text-sm text-stone-600 font-light leading-relaxed whitespace-pre-line">{booking.requests}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <a
          href={`mailto:${booking.email}?subject=Re: Your Bond experience request`}
          className="inline-block px-6 py-3 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors"
        >
          Reply via Email
        </a>
      </div>
    </div>
  );
}
