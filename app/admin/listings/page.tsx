import Link from "next/link";
import { getTours } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const tours = await getTours();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Listings
          </h1>
          <p className="text-stone-400 text-sm mt-1">{tours.length} experiences</p>
        </div>
        <Link
          href="/admin/listings/new"
          className="px-6 py-3 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors"
        >
          + New Listing
        </Link>
      </div>

      <div className="bg-white border border-stone-100">
        {tours.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-stone-400 text-sm mb-4">No listings yet.</p>
            <Link href="/admin/listings/new" className="text-xs text-[#016812] hover:underline">
              Create your first listing →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                {["Photo", "Title", "Tag", "Duration", "Price", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs tracking-widest uppercase text-stone-400 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    {tour.images[0] ? (
                      <img src={tour.images[0]} alt={tour.title} className="w-14 h-10 object-cover" />
                    ) : (
                      <div className="w-14 h-10 bg-stone-100" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#1A1A1A]">{tour.title}</p>
                    <p className="text-xs text-stone-400 italic">{tour.subtitle}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">{tour.tag}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">{tour.duration}</td>
                  <td className="px-6 py-4 text-sm text-stone-500">{tour.priceFrom || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/listings/${tour.id}`}
                      className="text-xs text-[#016812] hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/tour/${tour.id}`}
                      target="_blank"
                      className="text-xs text-stone-400 hover:text-stone-600"
                    >
                      View ↗
                    </Link>
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
