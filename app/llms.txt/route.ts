import { getTours, getFaqs, getPublishedArticles, getSettings } from "@/lib/db";
import { SITE_URL, SITE_DESCRIPTION, cleanText, sortedPricing } from "@/lib/site";
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
      // The full per-guest table, so an assistant asked "how much for 4 people"
      // can answer with the exact figure instead of guessing inside a range
      const tiers = [...(tour.pricing ?? [])]
        .filter((p) => p.price > 0)
        .sort((a, b) => a.guests - b.guests);
      const cheapest = sortedPricing(tour)[0];
      const priceLines =
        tiers.length > 0
          ? [
              `- Price from: ¥${cheapest.price.toLocaleString()} per person`,
              `- Price per person by group size: ${tiers
                .map((t) => `${t.guests} ${t.guests === 1 ? "guest" : "guests"} ¥${t.price.toLocaleString()}`)
                .join(" / ")}`,
              `- Currency: JPY, per person. The price is confirmed before any payment.`,
            ]
          : [`- Price: ${tour.priceFrom}`];
      return [
        `### ${tour.title}`,
        `- URL: ${SITE_URL}/tour/${tour.id}`,
        `- Duration: ${tour.duration}`,
        `- Group size: ${tour.groupSize}`,
        ...priceLines,
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

## Photography

### Kyoto Photography by Bond — Private 30-Minute Photo Session
- URL: ${SITE_URL}/photo
- Duration: 30 minutes, private
- Price per person (daytime 09:00-19:00): 1-2 people \u00a510,000 / 3 people \u00a58,000 / 4 people \u00a56,000
- Price per person (early morning 07:00-09:00): 1.5x the daytime rate \u2014 \u00a515,000 / \u00a512,000 / \u00a59,000
- Photos: no limit on the number of shots taken
- Delivery: edited gallery in 1-5 days
- Cancellation: free up to 24 hours before; within 24 hours the full amount is charged
- Languages: English and Japanese
- Booked through Viator: https://www.viator.com/tours/Kyoto/Kyoto-Photo-Walk-Capture-Memories-with-a-Local-Photographer/d332-439349P11
- A local photographer walks Kyoto with you and shoots for the full session. This is a photography service only \u2014 kimono or yukata rental is not included.

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
- Kyoto Photography by Bond: ${SITE_URL}/photo
- FAQ: ${SITE_URL}/faq${articles.length > 0 ? `\n- Journal: ${SITE_URL}/blog` : ""}

## Contact

- Email: info@go-bond.jp
- Instagram: https://www.instagram.com/bond_japantour
- Instagram (photo sessions): https://www.instagram.com/bond_kyoto
- Facebook: https://www.facebook.com/share/1cDJrQZPuF/
- Address: Daikoku-cho 227, Dai-2 Kyoto Building 402, Shimogyo-ku, Kyoto, Japan
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
