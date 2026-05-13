import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TourSidebar from "@/components/TourSidebar";
import { getTourById, getTours } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((t) => ({ id: t.id }));
}

export const dynamic = "force-dynamic";

export default async function TourPage({ params }: Props) {
  const { id } = await params;
  const tour = await getTourById(id);
  if (!tour) notFound();

  return (
    <>
      <Nav />
      <main className="pt-0">
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url('${tour.images[0]}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative z-10 px-6 pb-16 max-w-5xl mx-auto w-full">
            <p className="text-xs tracking-[0.3em] uppercase text-[#6DBF6D] mb-3">
              {tour.tag} — {tour.duration}
            </p>
            <h1
              className="text-4xl md:text-6xl font-light text-white leading-tight mb-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {tour.title}
            </h1>
            <p className="text-white/60 italic text-xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {tour.subtitle}
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main */}
            <div className="lg:col-span-2 space-y-16">
              {/* Description */}
              <div>
                <p className="text-stone-600 font-light leading-relaxed text-lg">
                  {tour.description}
                </p>
              </div>

              {/* Highlights */}
              {tour.highlights.length > 0 && (
                <div>
                  <h2
                    className="text-2xl font-light text-[#1A1A1A] mb-8"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Experience highlights
                  </h2>
                  <ul className="space-y-4">
                    {tour.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#016812] flex-shrink-0" />
                        <span className="text-stone-600 font-light text-sm leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Includes / Excludes */}
              {(tour.includes?.length > 0 || tour.excludes?.length > 0) && (
                <div>
                  <h2
                    className="text-2xl font-light text-[#1A1A1A] mb-8"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    What&apos;s included
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tour.includes?.length > 0 && (
                      <div>
                        <p className="text-xs tracking-widest uppercase text-[#016812] mb-4">Included</p>
                        <ul className="space-y-3">
                          {tour.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-[#016812] mt-0.5 flex-shrink-0">✓</span>
                              <span className="text-stone-600 font-light text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tour.excludes?.length > 0 && (
                      <div>
                        <p className="text-xs tracking-widest uppercase text-stone-400 mb-4">Not included</p>
                        <ul className="space-y-3">
                          {tour.excludes.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="text-stone-300 mt-0.5 flex-shrink-0">✕</span>
                              <span className="text-stone-500 font-light text-sm leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {tour.itinerary.length > 0 && (
                <div>
                  <h2
                    className="text-2xl font-light text-[#1A1A1A] mb-8"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Sample itinerary
                  </h2>
                  <div className="space-y-0">
                    {tour.itinerary.map((item, i) => (
                      <div key={i} className="flex gap-6 py-5 border-b border-stone-100 last:border-b-0">
                        <span className="text-xs text-[#016812] font-medium whitespace-nowrap flex-shrink-0 mt-0.5">
                          {item.time}
                        </span>
                        {item.activity && (
                          <span className="text-stone-600 font-light text-sm leading-relaxed">
                            {item.activity}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Before you book */}
              {tour.beforeYouBook?.length > 0 && (
                <div className="bg-[#F5F4F2] p-8">
                  <h2
                    className="text-xl font-light text-[#1A1A1A] mb-6"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Before you book
                  </h2>
                  <ul className="space-y-3">
                    {tour.beforeYouBook.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-stone-400 mt-0.5 flex-shrink-0 text-xs">—</span>
                        <span className="text-stone-600 font-light text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Photos */}
              {tour.images.length > 1 && (
                <div>
                  <h2
                    className="text-2xl font-light text-[#1A1A1A] mb-8"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Photos
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {tour.images.slice(1).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${tour.title} ${i + 2}`}
                        className="w-full h-48 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TourSidebar tour={tour} />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="bg-[#1A1A1A] py-20 px-6 text-center text-white">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6DBF6D] mb-4">
            Your experience, your way
          </p>
          <h2
            className="text-3xl md:text-4xl font-light mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            This is a starting point — not a fixed tour.
          </h2>
          <p className="text-white/60 font-light mb-10 max-w-lg mx-auto text-sm">
            Tell us your dates, your group, and your interests. We&apos;ll shape this experience around you.
          </p>
          <Link
            href={`/booking?tour=${tour.id}`}
            className="inline-block px-12 py-5 bg-white text-[#1A1A1A] text-xs tracking-widest uppercase hover:bg-[#016812] hover:text-white transition-all duration-300"
          >
            Request This Experience
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
