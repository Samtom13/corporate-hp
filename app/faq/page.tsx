import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { getFaqs } from "@/lib/db";
import { organizationFacts } from "@/lib/content";
import {
  SITE_URL,
  organizationJsonLd,
  faqPageJsonLd,
  breadcrumbJsonLd,
  jsonLdDocument,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — Private Tours in Kyoto",
  description:
    "Answers about Bond's private Kyoto tours: pricing, booking, customization, languages, group sizes, and cancellation. No upfront payment required.",
  alternates: { canonical: "/faq" },
};


export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const [faqs, orgFacts] = await Promise.all([getFaqs(), organizationFacts()]);

  const jsonLd = jsonLdDocument([
    organizationJsonLd(orgFacts),
    faqPageJsonLd(faqs, `${SITE_URL}/faq`),
    breadcrumbJsonLd([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "FAQ", url: `${SITE_URL}/faq` },
    ]),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav solid />
      <main className="pt-24">
        <section className="py-20 px-6 bg-[#F5F4F2]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-4">
              Frequently asked questions
            </p>
            <h1
              className="text-4xl md:text-5xl font-light text-[#1A1A1A] leading-tight mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Everything you need to know.
            </h1>
            <p className="text-stone-500 font-light leading-relaxed">
              How booking works, what tours cost, and how we shape each
              experience around you.
            </p>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-stone-100 pb-10 last:border-b-0">
                <h2
                  className="text-2xl font-light text-[#1A1A1A] mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {faq.question}
                </h2>
                <p className="text-stone-600 font-light leading-relaxed text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#1A1A1A] py-20 px-6 text-center text-white">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6DBF6D] mb-4">
            Still have questions?
          </p>
          <h2
            className="text-3xl md:text-4xl font-light mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Just ask — it starts with a conversation.
          </h2>
          <p className="text-white/60 font-light mb-10 max-w-lg mx-auto text-sm">
            Tell us your dates, your group, and your interests. No payment
            required to begin.
          </p>
          <Link
            href="/booking"
            className="inline-block px-12 py-5 bg-white text-[#1A1A1A] text-xs tracking-widest uppercase hover:bg-[#016812] hover:text-white transition-all duration-300"
          >
            Create Your Experience
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
