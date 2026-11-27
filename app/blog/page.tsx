import Link from "next/link";
import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { publishedArticles, organizationFacts } from "@/lib/content";
import {
  SITE_URL,
  SITE_NAME,
  organizationJsonLd,
  breadcrumbJsonLd,
  jsonLdDocument,
} from "@/lib/site";
import { formatDate, readingMinutes } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kyoto Travel Journal — Guides & Local Tips",
  description:
    "Practical guides to visiting Kyoto and Uji, written by the local English-speaking guides at Bond: when to go, what to book, and what most visitors miss.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const [articles, orgFacts] = await Promise.all([publishedArticles(), organizationFacts()]);
  const [featured, ...rest] = articles;

  const jsonLd = jsonLdDocument([
    organizationJsonLd(orgFacts),
    {
      "@type": "Blog",
      "@id": `${SITE_URL}/blog#blog`,
      url: `${SITE_URL}/blog`,
      name: `${SITE_NAME} — Kyoto Travel Journal`,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
      blogPost: articles.map((a) => ({
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${a.id}#article`,
        headline: a.title,
        url: `${SITE_URL}/blog/${a.id}`,
        datePublished: a.publishedAt,
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Journal", url: `${SITE_URL}/blog` },
    ]),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav />
      <main className="pt-24">
        <section className="py-20 px-6 bg-[#F5F4F2]">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-4">Journal</p>
            <h1
              className="text-4xl md:text-5xl font-light text-[#1A1A1A] leading-tight mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Kyoto, from the people who walk it daily.
            </h1>
            <p className="text-stone-500 font-light leading-relaxed">
              Guides, seasons, and the small details that make a trip to Kyoto feel like
              yours — written by our local guides.
            </p>
          </div>
        </section>

        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            {articles.length === 0 ? (
              <p className="text-center text-stone-400 font-light">
                New guides are on the way. In the meantime,{" "}
                <Link href="/faq" className="text-[#016812] hover:underline">
                  read our FAQ
                </Link>{" "}
                or{" "}
                <Link href="/booking" className="text-[#016812] hover:underline">
                  tell us what you&rsquo;d like to see
                </Link>
                .
              </p>
            ) : (
              <>
                {/* Featured — most recent */}
                <Link href={`/blog/${featured.id}`} className="group block mb-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                      {featured.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={featured.coverImage}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-[#016812] mb-4">
                        {featured.tags[0] ?? "Latest"}
                      </p>
                      <h2
                        className="text-3xl md:text-4xl font-light text-[#1A1A1A] leading-tight mb-4 group-hover:text-[#016812] transition-colors"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        {featured.title}
                      </h2>
                      <p className="text-stone-500 font-light leading-relaxed text-sm mb-5">
                        {featured.excerpt}
                      </p>
                      <p className="text-xs text-stone-400">
                        {formatDate(featured.publishedAt)} ·{" "}
                        {readingMinutes(featured.body)} min read
                      </p>
                    </div>
                  </div>
                </Link>

                {rest.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-stone-100 pt-16">
                    {rest.map((article) => (
                      <Link
                        key={article.id}
                        href={`/blog/${article.id}`}
                        className="group block"
                      >
                        <div className="aspect-[3/2] overflow-hidden bg-stone-100 mb-5">
                          {article.coverImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          )}
                        </div>
                        {article.tags[0] && (
                          <p className="text-xs tracking-widest uppercase text-[#016812] mb-3">
                            {article.tags[0]}
                          </p>
                        )}
                        <h3
                          className="text-xl font-light text-[#1A1A1A] leading-snug mb-3 group-hover:text-[#016812] transition-colors"
                          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                        >
                          {article.title}
                        </h3>
                        <p className="text-stone-500 font-light leading-relaxed text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <p className="text-xs text-stone-400">
                          {formatDate(article.publishedAt)} · {readingMinutes(article.body)} min
                          read
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="bg-[#1A1A1A] py-20 px-6 text-center text-white">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6DBF6D] mb-4">
            Ready when you are
          </p>
          <h2
            className="text-3xl md:text-4xl font-light mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Let&rsquo;s build your Kyoto.
          </h2>
          <p className="text-white/60 font-light mb-10 max-w-lg mx-auto text-sm">
            Tell us your dates, your group, and your interests. No payment required to begin.
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
