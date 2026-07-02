import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getTours } from "@/lib/db";
import {
  SITE_URL,
  SITE_NAME,
  organizationJsonLd,
  tourJsonLd,
  jsonLdDocument,
} from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const steps = [
  {
    number: "01",
    title: "Send Your Request",
    body: "Tell us who you are, when you're coming, and what you're curious about. No payment. No commitment.",
  },
  {
    number: "02",
    title: "We Design Your Experience",
    body: "We review your request and craft a personalized itinerary. We'll confirm every detail with you directly.",
  },
  {
    number: "03",
    title: "Live It",
    body: "Meet your guide. Discover a Kyoto that belongs to you — unhurried, unscripted, and unforgettable.",
  },
];

const testimonials = [
  {
    quote:
      "Bond didn't just show me Kyoto. They helped me understand it. I left feeling like I had a genuine connection to a place I'd only dreamed about.",
    name: "Sarah M.",
    origin: "New York, USA",
  },
  {
    quote:
      "I've traveled a lot. I've never felt so looked after. Every detail was perfect, and it felt completely natural — not staged.",
    name: "Thomas R.",
    origin: "London, UK",
  },
  {
    quote:
      "The food tour was unlike anything. No English menus, no tourist traps. Just real food, real people, real Kyoto.",
    name: "Elisa K.",
    origin: "Berlin, Germany",
  },
];

export default async function HomePage() {
  const experiences = await getTours();

  const jsonLd = jsonLdDocument([
    {
      ...organizationJsonLd(),
      review: testimonials.map((t) => ({
        "@type": "Review",
        reviewBody: t.quote,
        author: { "@type": "Person", name: t.name },
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#tours`,
      name: "Private tours in Kyoto by Bond",
      itemListElement: experiences.map((tour, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: tourJsonLd(tour),
      })),
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        {/* ── Hero ── */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1800&q=90')",
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <p
              className="text-xs tracking-[0.3em] uppercase text-white/60 mb-8 animate-fade-in"
              style={{ animationDelay: "0.2s", opacity: 0 }}
            >
              Kyoto, Japan — Private Experiences
            </p>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-8 animate-fade-up text-[#6DBF6D]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                animationDelay: "0.4s",
                opacity: 0,
              }}
            >
              Be part of Japan,
              <br />
              <em>not just a visitor.</em>
            </h1>
            <p
              className="text-base md:text-lg text-white/70 font-light tracking-wide mb-12 animate-fade-up"
              style={{ animationDelay: "0.7s", opacity: 0 }}
            >
              A fully personalized experience.
            </p>
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
              style={{ animationDelay: "0.9s", opacity: 0 }}
            >
              <Link
                href="/booking"
                className="px-10 py-4 bg-white text-[#1A1A1A] text-xs tracking-widest uppercase hover:bg-[#016812] hover:text-white transition-all duration-300"
              >
                Create Your Experience
              </Link>
              <Link
                href="/#experiences"
                className="px-10 py-4 border border-white/60 text-white text-xs tracking-widest uppercase hover:bg-white/10 transition-all duration-300"
              >
                Explore Experiences
              </Link>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: "1.2s", opacity: 0 }}>
            <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-white/30" />
          </div>
        </section>

        {/* ── About Bond ── */}
        <section id="about" className="py-28 px-6 bg-white">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-6">
                What is Bond
              </p>
              <h2
                className="text-4xl md:text-5xl font-light leading-tight text-[#1A1A1A] mb-8"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Travel as connection,
                <br />
                not just observation.
              </h2>
              <p className="text-stone-500 font-light leading-relaxed mb-5">
                We believe the real value of travel lies in encounters — in being alongside people, sharing moments, doing things together.
              </p>
              <p className="text-stone-500 font-light leading-relaxed mb-5">
                Not as a guest being hosted, but as one person meeting another. It&apos;s only through that kind of genuine connection that you begin to see things differently.
              </p>
              <p className="text-stone-500 font-light leading-relaxed mb-10">
                What we offer isn&apos;t sightseeing. It&apos;s experience born from connection — and through it, a feeling that you&apos;ve truly become part of this community, part of Japan.
              </p>
              <Link
                href="/booking"
                className="text-xs tracking-widest uppercase border-b border-[#1A1A1A] pb-1 hover:border-[#016812] hover:text-[#016812] transition-colors"
              >
                Start with a request →
              </Link>
            </div>
            <div className="relative h-96 md:h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80"
                alt="Kyoto street"
                className="w-full h-full object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#016812] text-white px-6 py-4 hidden md:block">
                <p className="text-xs tracking-widest uppercase mb-1">Since</p>
                <p
                  className="text-3xl font-light"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  2019
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Experiences ── */}
        <section id="experiences" className="py-28 px-6 bg-[#F5F4F2]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-4">
                Curated for you
              </p>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1A1A1A]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Experience Kyoto differently.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((exp) => (
                <Link key={exp.id} href={`/tour/${exp.id}`} className="group block bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="overflow-hidden h-64">
                    <img
                      src={exp.images[0]}
                      alt={exp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs tracking-widest uppercase text-[#016812]">
                        {exp.tag}
                      </span>
                      <span className="text-xs text-stone-400">{exp.duration}</span>
                    </div>
                    <h3
                      className="text-xl font-light text-[#1A1A1A] mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {exp.title}
                    </h3>
                    <p className="text-sm text-stone-400 mb-4 italic">{exp.subtitle}</p>
                    <p className="text-sm text-stone-500 font-light leading-relaxed line-clamp-3">
                      {exp.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-xs text-stone-400">{exp.groupSize}</span>
                      <span className="text-xs tracking-widest uppercase text-[#1A1A1A] group-hover:text-[#016812] transition-colors">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="py-28 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-4">
                Simple process
              </p>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1A1A1A]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                How it works.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {steps.map((step) => (
                <div key={step.number} className="text-center md:text-left">
                  <p
                    className="text-6xl font-light text-[#016812]/20 mb-6"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {step.number}
                  </p>
                  <h3
                    className="text-xl font-light text-[#1A1A1A] mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-stone-500 font-light leading-relaxed text-sm">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-20 bg-[#1A1A1A] text-white p-12 text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-4">
                Start with a request
              </p>
              <h3
                className="text-3xl md:text-4xl font-light mb-4"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                No upfront payment required.
              </h3>
              <p className="text-white/60 font-light mb-8 max-w-xl mx-auto">
                We&apos;ll design a personalized experience and confirm every detail
                before any payment is needed.
              </p>
              <Link
                href="/booking"
                className="inline-block px-10 py-4 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors duration-300"
              >
                Create Your Experience
              </Link>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-28 px-6 bg-[#F5F4F2]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-4">
                Guest stories
              </p>
              <h2
                className="text-4xl md:text-5xl font-light text-[#1A1A1A]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                What our guests say.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white p-8">
                  <p
                    className="text-4xl text-[#016812]/20 font-serif mb-4 leading-none"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    "
                  </p>
                  <p className="text-stone-600 font-light leading-relaxed italic mb-6 text-sm">
                    {t.quote}
                  </p>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{t.name}</p>
                    <p className="text-xs text-stone-400 mt-1">{t.origin}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative py-40 px-6 flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1545048702-79362596cdc9?w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center text-white max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[#6DBF6D] mb-6">
              Your journey starts here
            </p>
            <h2
              className="text-4xl md:text-6xl font-light leading-tight mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Ready to experience
              <br />
              <em>the real Kyoto?</em>
            </h2>
            <p className="text-white/60 font-light mb-10">
              No payment required to begin. Just tell us about yourself.
            </p>
            <Link
              href="/booking"
              className="inline-block px-12 py-5 bg-white text-[#1A1A1A] text-xs tracking-widest uppercase hover:bg-[#016812] hover:text-white transition-all duration-300"
            >
              Create Your Experience
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
