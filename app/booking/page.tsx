import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookingForm from "./BookingForm";
import { getTours } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Request a Private Kyoto Tour — No Upfront Payment",
  description:
    "Request a personalized private tour in Kyoto. Tell us your dates, group, and interests — we design your experience and confirm every detail before any payment.",
  alternates: { canonical: "/booking" },
};

export default async function BookingPage() {
  const tours = await getTours();

  return (
    <>
      <Nav />
      <main className="pt-24">
        <section className="py-20 px-6 bg-[#F5F4F2]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-4">
              Start with a request. No payment required.
            </p>
            <h1
              className="text-4xl md:text-5xl font-light text-[#1A1A1A] leading-tight mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Create Your Experience
            </h1>
            <p className="text-stone-500 font-light leading-relaxed">
              We&apos;ll design a personalized experience and confirm details before any payment.
              This is a conversation, not a booking form.
            </p>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <BookingForm tours={tours} />
          </div>
        </section>

        <section className="py-16 px-6 bg-[#1A1A1A] text-white">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { title: "No upfront payment", body: "We confirm every detail before you pay anything." },
              { title: "Fully customized", body: "Your experience is built around you, not a template." },
              { title: "Human connection", body: "A real person will reach out within 24 hours." },
            ].map((item) => (
              <div key={item.title}>
                <p className="text-lg font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {item.title}
                </p>
                <p className="text-white/50 text-xs font-light leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
