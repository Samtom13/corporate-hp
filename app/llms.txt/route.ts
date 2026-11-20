import { getTours, getFaqs, getPublishedArticles, getSettings } from "@/lib/db";
import { SITE_URL, SITE_DESCRIPTION, cleanText } from "@/lib/site";
import { markdownToPlainText } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export async function GET() {
  const [tours, faqs, articles, settings] = await Promise.all([
    getTours(),
    getFaqs(),
    getPublishedArticles(),
    getSettings(),
  ]);

  const tourSections = tours
    .map((tour) => {
      const prices = (tour.pricing ?? []).map((p) => p.price).filter((p) => p > 0);
      const priceLine =
        prices.length > 0
          ? `Price: ¥${Math.min(...prices).toLocaleString()}–¥${Math.max(...prices).toLocaleString()} JPY (varies by group size)`
          : `Price: ${tour.priceFrom}`;
      return [
        `### ${tour.title}`,
        `- URL: ${SITE_URL}/tour/${tour.id}`,
        `- Duration: ${tour.duration}`,
        `- Group size: ${tour.groupSize}`,
        `- ${priceLine}`,
        `- ${cleanText(tour.description, 400)}`,
      ].join("\n");
    })
    .join("\n\n");

  const faqSection = faqs
    .map((faq) => `### ${faq.question}\n${cleanText(faq.answer, 600)}`)
    .join("\n\n");

  const articleSection = articles
    .map((article) =>
      [
        `### ${article.title}`,
        `- URL: ${SITE_URL}/blog/${article.id}`,
        `- Published: ${article.publishedAt}`,
        ...(article.tags.length > 0 ? [`- Topics: ${article.tags.join(", ")}`] : []),
        `- ${cleanText(article.excerpt || markdownToPlainText(article.body), 400)}`,
      ].join("\n")
    )
    .join("\n\n");

  const body = `# Bond — Private Tours in Kyoto

> ${SITE_DESCRIPTION}

Bond (株式会社Bond) is a Kyoto-based travel company founded in 2019. It designs
private, fully personalized tour experiences in Kyoto and Uji, Japan, led by
local English-speaking guides. Booking starts with a free request — no upfront
payment is required; every itinerary is confirmed directly with the guest
before any payment.

Rated ${settings.reviewRating} out of 5 across ${settings.reviewCount}+ reviews on Klook, GetYourGuide, and Viator.

## Tours

${tourSections}

## Frequently asked questions

${faqSection}
${articleSection ? `\n## Guides and articles\n\n${articleSection}\n` : ""}
## How booking works

1. Send a request via ${SITE_URL}/booking (dates, group, interests).
2. Bond designs a personalized itinerary and confirms every detail directly.
3. Meet your guide in Kyoto — no payment is required until details are confirmed.

## Pages

- Home: ${SITE_URL}/
- Request an experience: ${SITE_URL}/booking
- FAQ: ${SITE_URL}/faq${articles.length > 0 ? `\n- Journal: ${SITE_URL}/blog` : ""}

## Contact

- Email: info@go-bond.jp
- Instagram: https://www.instagram.com/bond_kyoto
- Facebook: https://www.facebook.com/share/1cDJrQZPuF/
- Address: Daikoku-cho 227, Dai-2 Kyoto Building 402, Shimogyo-ku, Kyoto, Japan
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
