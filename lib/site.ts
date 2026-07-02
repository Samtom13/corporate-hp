import type { Tour } from "@/lib/db";

export const SITE_URL = "https://go-bond.jp";
export const SITE_NAME = "Bond";
export const SITE_DESCRIPTION =
  "Private, fully personalized tours in Kyoto led by local English-speaking guides. Full-day highlights, Uji matcha experiences, Gion sake night walks, and 100% customized itineraries. No upfront payment required.";
export const OG_IMAGE =
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80";

export const SOCIAL_LINKS = [
  "https://www.instagram.com/bond_kyoto",
  "https://www.facebook.com/share/1cDJrQZPuF/",
];

// Aggregate across OTA platforms (Klook, GetYourGuide, Viator). Update as reviews grow.
export const REVIEW_RATING = 4.8;
export const REVIEW_COUNT = 124;

/** Organization node shared across pages, referenced by @id */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function organizationJsonLd() {
  return {
    "@type": "TravelAgency",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    legalName: "株式会社Bond",
    url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION,
    email: "info@go-bond.jp",
    foundingDate: "2019",
    image: OG_IMAGE,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Daikoku-cho 227, Dai-2 Kyoto Building 402, Shimogyo-ku",
      addressLocality: "Kyoto",
      addressRegion: "Kyoto",
      addressCountry: "JP",
    },
    areaServed: [
      { "@type": "City", name: "Kyoto" },
      { "@type": "City", name: "Uji" },
    ],
    knowsLanguage: ["en", "ja"],
    priceRange: "¥5,000 - ¥34,000",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(REVIEW_RATING),
      reviewCount: String(REVIEW_COUNT),
      bestRating: "5",
    },
    sameAs: SOCIAL_LINKS,
  };
}

/** Strip extra whitespace/newlines from CMS text for use in meta tags and JSON-LD */
export function cleanText(text: string, maxLength = 300): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`;
}

export function tourJsonLd(tour: Tour) {
  const prices = (tour.pricing ?? []).map((p) => p.price).filter((p) => p > 0);
  const url = `${SITE_URL}/tour/${tour.id}`;

  return {
    "@type": ["Product", "TouristTrip"],
    "@id": `${url}#tour`,
    name: tour.title,
    description: cleanText(tour.description, 500),
    url,
    image: tour.images,
    brand: { "@id": ORGANIZATION_ID },
    provider: { "@id": ORGANIZATION_ID },
    touristType: "International visitors to Kyoto, Japan",
    ...(prices.length > 0
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "JPY",
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
            availability: "https://schema.org/InStock",
            url,
          },
        }
      : {}),
    additionalProperty: [
      { "@type": "PropertyValue", name: "Duration", value: tour.duration },
      { "@type": "PropertyValue", name: "Group size", value: tour.groupSize },
    ],
  };
}

/** Wrap one or more schema.org nodes in a @graph document */
export function jsonLdDocument(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
