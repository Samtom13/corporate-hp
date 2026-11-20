import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { getArticleById, getPublishedArticles, getSettings } from "@/lib/db";
import {
  SITE_URL,
  OG_IMAGE,
  organizationJsonLd,
  articleJsonLd,
  faqPageJsonLd,
  breadcrumbJsonLd,
  jsonLdDocument,
  cleanText,
} from "@/lib/site";
import {
  renderMarkdown,
  markdownToPlainText,
  formatDate,
  readingMinutes,
} from "@/lib/markdown";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleById(slug);
  if (!article || article.status !== "published") {
    return { title: "Article not found", robots: { index: false, follow: false } };
  }

  const description = cleanText(
    article.metaDescription || article.excerpt || markdownToPlainText(article.body),
    160
  );
  const image = article.coverImage || OG_IMAGE;

  return {
    title: article.metaTitle || article.title,
    description,
    alternates: { canonical: `/blog/${article.id}` },
    openGraph: {
      title: article.metaTitle || article.title,
      description,
      type: "article",
      url: `${SITE_URL}/blog/${article.id}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      images: [{ url: image, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle || article.title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleById(slug);
  if (!article || article.status !== "published") notFound();

  const [all, settings] = await Promise.all([getPublishedArticles(), getSettings()]);
  const related = all.filter((a) => a.id !== article.id).slice(0, 3);
  const plainBody = markdownToPlainText(article.body);
  const url = `${SITE_URL}/blog/${article.id}`;

  const jsonLd = jsonLdDocument([
    organizationJsonLd({ rating: settings.reviewRating, count: settings.reviewCount }),
    articleJsonLd(article, plainBody),
    ...(article.faqs.length > 0 ? [faqPageJsonLd(article.faqs, url)] : []),
    breadcrumbJsonLd([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Journal", url: `${SITE_URL}/blog` },
      { name: article.title, url },
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
        {/* Header */}
        <article>
          <header className="py-16 px-6 bg-[#F5F4F2]">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/blog"
                className="text-xs tracking-widest uppercase text-[#016812] hover:underline"
              >
                ← Journal
              </Link>
              <h1
                className="text-3xl md:text-5xl font-light text-[#1A1A1A] leading-tight mt-6 mb-6"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="text-stone-500 font-light leading-relaxed mb-6">
                  {article.excerpt}
                </p>
              )}
              <p className="text-xs text-stone-400">
                {article.author} · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> ·{" "}
                {readingMinutes(article.body)} min read
              </p>
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs tracking-widest uppercase text-stone-400 border border-stone-200 px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {article.coverImage && (
            <div className="max-w-5xl mx-auto px-6 -mt-0">
              <div className="aspect-[16/9] overflow-hidden bg-stone-100 mt-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Body */}
          <div className="py-16 px-6">
            <div
              className="article-body max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(article.body) }}
            />
          </div>

          {/* Article FAQ */}
          {article.faqs.length > 0 && (
            <section className="px-6 pb-16">
              <div className="max-w-2xl mx-auto border-t border-stone-100 pt-14">
                <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-8">
                  Frequently asked
                </p>
                <div className="space-y-8">
                  {article.faqs.map((faq, i) => (
                    <div key={i}>
                      <h2
                        className="text-xl font-light text-[#1A1A1A] mb-3"
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
              </div>
            </section>
          )}
        </article>

        {/* CTA */}
        <section className="bg-[#1A1A1A] py-20 px-6 text-center text-white">
          <p className="text-xs tracking-[0.3em] uppercase text-[#6DBF6D] mb-4">
            Plan it with a local
          </p>
          <h2
            className="text-3xl md:text-4xl font-light mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Want to see this for yourself?
          </h2>
          <p className="text-white/60 font-light mb-10 max-w-lg mx-auto text-sm">
            Tell us your dates and interests. We design the itinerary — no payment required
            to begin.
          </p>
          <Link
            href="/booking"
            className="inline-block px-12 py-5 bg-white text-[#1A1A1A] text-xs tracking-widest uppercase hover:bg-[#016812] hover:text-white transition-all duration-300"
          >
            Create Your Experience
          </Link>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="py-20 px-6 bg-[#F5F4F2]">
            <div className="max-w-5xl mx-auto">
              <p className="text-xs tracking-[0.3em] uppercase text-[#016812] mb-10 text-center">
                Keep reading
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((item) => (
                  <Link key={item.id} href={`/blog/${item.id}`} className="group block bg-white">
                    <div className="aspect-[3/2] overflow-hidden bg-stone-100">
                      {item.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <h3
                        className="text-lg font-light text-[#1A1A1A] leading-snug mb-2 group-hover:text-[#016812] transition-colors"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-400">
                        {formatDate(item.publishedAt)} · {readingMinutes(item.body)} min read
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
