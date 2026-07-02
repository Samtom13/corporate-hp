import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL, organizationJsonLd, jsonLdDocument } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — Private Tours in Kyoto",
  description:
    "Answers about Bond's private Kyoto tours: pricing, booking, customization, languages, group sizes, and cancellation. No upfront payment required.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    question: "How do I book a private tour in Kyoto with Bond?",
    answer:
      "Send a request through our booking page with your dates, group size, and interests. We review your request, design a personalized itinerary, and confirm every detail with you directly by email or WhatsApp before anything is finalized. There is no payment and no commitment at the request stage.",
  },
  {
    question: "Do I need to pay upfront to book?",
    answer:
      "No. Bond requires no upfront payment. We first design your experience and confirm all details with you — payment only happens after you are happy with the plan.",
  },
  {
    question: "How much does a private tour in Kyoto cost?",
    answer:
      "Prices depend on the tour and group size. The Gion Sake Night Walk (1.5 hours) starts from ¥5,000 per person, the 3-hour fully customized private tour from ¥10,000, the 4-hour Uji matcha tour from ¥12,000, and the full-day Kyoto highlights tour (8 hours, covering Arashiyama, Kinkakuji, Gion, and Fushimi Inari) from ¥14,000 per person. Larger groups pay less per person.",
  },
  {
    question: "Can I customize the itinerary?",
    answer:
      "Yes — customization is what Bond is built around. Every tour is a starting point, not a fixed route. We also offer a 100% customized 3-hour private tour where you choose one to three places you'd like to visit with a local guide, at your pace.",
  },
  {
    question: "Are the tours conducted in English?",
    answer:
      "Yes. All tours are led by local English-speaking guides based in Kyoto.",
  },
  {
    question: "Where do the tours take place?",
    answer:
      "Our experiences cover Kyoto — including Arashiyama, Kinkakuji, Gion, Higashiyama, and Fushimi Inari — as well as Uji, the home of Japanese matcha.",
  },
  {
    question: "What group sizes do you accept?",
    answer:
      "Group sizes range from 1 to 10 guests depending on the tour. The full-day and customized tours accept up to 8 guests, the Uji matcha tour up to 6, and the Gion Sake Night Walk up to 10.",
  },
  {
    question: "How can I contact Bond?",
    answer:
      "Email us at info@go-bond.jp, message us on Instagram (@bond_kyoto), or simply send a request through the booking page and we'll reply directly.",
  },
];

export default function FaqPage() {
  const jsonLd = jsonLdDocument([
    organizationJsonLd(),
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/faq#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
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
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-stone-100 pb-10 last:border-b-0">
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
