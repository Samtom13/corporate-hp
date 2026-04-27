import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getTourById, getTours } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getTours().map((t) => ({ id: t.id }));
}

export const dynamic = "force-dynamic";

export default async function TourPage({ params }: Props) {
  const { id } = await params;
  const tour = getTourById(id);
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
              <div>
                <p className="text-stone-600 font-light leading-relaxed text-lg">
                  {tour.description}
                </p>
              </div>

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
                      <span className="text-xs text-[#016812] font-medium w-12 flex-shrink-0 mt-0.5">
                        {item.time}
                      </span>
                      <span className="text-stone-600 font-light text-sm leading-relaxed">
                        {item.activity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

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
              <div className="sticky top-28 bg-[#F5F4F2] p-8 space-y-6">
                <div>
                  <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Duration</p>
                  <p className="text-sm text-[#1A1A1A] font-light">{tour.duration}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Group size</p>
                  <p className="text-sm text-[#1A1A1A] font-light">{tour.groupSize}</p>
                </div>
                {tour.priceFrom && (
                  <div>
                    <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">Pricing</p>
                    <p className="text-sm text-[#1A1A1A] font-light">{tour.priceFrom}</p>
                    <p className="text-xs text-stone-400 mt-1">Exact price confirmed after your request.</p>
                  </div>
                )}
                <div className="border-t border-stone-200 pt-6">
                  <p className="text-xs text-stone-400 leading-relaxed mb-6">
                    No payment required. We&apos;ll design your personalized experience and confirm all details first.
                  </p>
                  <Link
                    href={`/booking?tour=${tour.id}`}
                    className="block w-full text-center py-4 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors duration-300"
                  >
                    Request This Experience
                  </Link>
                </div>
                <div className="border-t border-stone-200 pt-6">
                  <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">Questions?</p>
                  <a
                    href="mailto:info@go-bond.jp"
                    className="text-sm text-[#1A1A1A] hover:text-[#016812] transition-colors font-light"
                  >
                    info@go-bond.jp →
                  </a>
                </div>
              </div>
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
