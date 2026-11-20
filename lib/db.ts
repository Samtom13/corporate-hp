import { put } from "@vercel/blob";
import toursData from "@/data/tours.json";
import articlesData from "@/data/articles.json";
import faqsData from "@/data/faqs.json";
import reviewsData from "@/data/reviews.json";

export type Tour = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  duration: string;
  groupSize: string;
  priceFrom: string;
  description: string;
  highlights: string[];
  itinerary: { time: string; activity: string }[];
  images: string[];
  pricing: { guests: number; price: number }[];
  includes: string[];
  excludes: string[];
  beforeYouBook: string[];
};

export type Booking = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  whatsapp: string;
  guests: string;
  date?: string;
  flexibleDates: boolean;
  selectedTour?: string;
  selectedInterests: string[];
  requests?: string;
  status: "new" | "contacted" | "confirmed" | "cancelled";
};

const TOURS_PATH = "bond-data/tours.json";
const BOOKINGS_PATH = "bond-data/bookings.json";

function withDefaults(t: object): Tour {
  return {
    ...({ pricing: [], includes: [], excludes: [], beforeYouBook: [] } as unknown as Tour),
    ...(t as Tour),
  };
}

/**
 * Derive the public Blob base URL from BLOB_READ_WRITE_TOKEN.
 * Token format: vercel_blob_rw_{storeId}_{secret}
 * Public URL:   https://{storeId}.public.blob.vercel-storage.com
 */
function getBlobBaseUrl(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  if (token.startsWith("vercel_blob_rw_")) {
    const rest = token.slice("vercel_blob_rw_".length); // "{storeId}_{secret}"
    const lastUnderscore = rest.lastIndexOf("_");
    if (lastUnderscore > 0) {
      const storeId = rest.slice(0, lastUnderscore);
      return `https://${storeId}.public.blob.vercel-storage.com`;
    }
  }

  // JWT format fallback
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    if (payload.sub) {
      return `https://${payload.sub}.public.blob.vercel-storage.com`;
    }
  } catch { /* */ }

  return null;
}

/**
 * Read JSON array directly from the public blob URL.
 * Returns:
 *   T[]   — success
 *   []    — file not found (404) = first run, safe to seed
 *   null  — fetch/network error = DO NOT overwrite blob
 */
async function readBlob<T>(pathname: string): Promise<T[] | null> {
  const baseUrl = getBlobBaseUrl();
  if (!baseUrl) return null;
  try {
    const res = await fetch(`${baseUrl}/${pathname}`, { cache: "no-store" });
    if (res.status === 404) return [] as T[]; // first run
    if (!res.ok) return null;                 // transient error — caller must not overwrite
    return (await res.json()) as T[];
  } catch {
    return null; // network error — caller must not overwrite
  }
}

/** Write JSON array via @vercel/blob put() — SDK handles token/store auth correctly */
async function writeBlob<T>(pathname: string, data: T[]): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

// ── Tours ──────────────────────────────────────────────

export async function getTours(): Promise<Tour[]> {
  const stored = await readBlob<Tour>(TOURS_PATH);

  // null = fetch/network error → return static fallback WITHOUT overwriting blob
  // (prevents user edits from being wiped on transient CDN/network failures)
  if (stored === null) {
    return (toursData as object[]).map(withDefaults);
  }

  // [] = 404 (first run) → seed and persist
  if (stored.length === 0) {
    const seed = (toursData as object[]).map(withDefaults);
    try {
      await writeBlob(TOURS_PATH, seed);
    } catch {
      // blob not reachable yet
    }
    return seed;
  }

  return stored.map(withDefaults);
}

export async function getTourById(id: string): Promise<Tour | undefined> {
  const tours = await getTours();
  return tours.find((t) => t.id === id);
}

export async function saveTour(tour: Tour): Promise<void> {
  const tours = await getTours();
  const idx = tours.findIndex((t) => t.id === tour.id);
  if (idx >= 0) {
    tours[idx] = tour;
  } else {
    tours.push(tour);
  }
  await writeBlob(TOURS_PATH, tours);
}

export async function deleteTour(id: string): Promise<void> {
  const tours = (await getTours()).filter((t) => t.id !== id);
  await writeBlob(TOURS_PATH, tours);
}

// ── Bookings ───────────────────────────────────────────

export async function getBookings(): Promise<Booking[]> {
  return (await readBlob<Booking>(BOOKINGS_PATH)) ?? [];
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  const bookings = await getBookings();
  return bookings.find((b) => b.id === id);
}

export async function saveBooking(booking: Booking): Promise<void> {
  const bookings = await getBookings();
  const idx = bookings.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    bookings[idx] = booking;
  } else {
    bookings.unshift(booking);
  }
  await writeBlob(BOOKINGS_PATH, bookings);
}

// ── Articles / FAQs / Reviews / Settings ───────────────

const ARTICLES_PATH = "bond-data/articles.json";
const FAQS_PATH = "bond-data/faqs.json";
const REVIEWS_PATH = "bond-data/reviews.json";
const SETTINGS_PATH = "bond-data/settings.json";

export type ArticleFaq = { question: string; answer: string };

export type Article = {
  /** URL slug — used as /blog/{id} */
  id: string;
  title: string;
  /** Short summary shown in listings and used as the meta description fallback */
  excerpt: string;
  /** Markdown body */
  body: string;
  coverImage: string;
  author: string;
  /** ISO date (YYYY-MM-DD) */
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  status: "draft" | "published";
  /** Optional SEO overrides */
  metaTitle?: string;
  metaDescription?: string;
  /** Question/answer pairs rendered on the article and emitted as FAQPage JSON-LD (AIO) */
  faqs: ArticleFaq[];
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type Review = {
  id: string;
  name: string;
  country: string;
  platform: string;
  text: string;
  rating: number;
  /** Shown in the "Guest stories" section on the homepage */
  featured: boolean;
};

export type SiteSettings = {
  /** Aggregate rating across OTA platforms, used in JSON-LD */
  reviewRating: number;
  reviewCount: number;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  reviewRating: 4.8,
  reviewCount: 124,
};

/**
 * Read a collection, seeding the blob from the static file on first run.
 * Mirrors getTours(): a network error returns the static seed WITHOUT writing.
 */
async function getCollection<T>(path: string, seed: T[]): Promise<T[]> {
  const stored = await readBlob<T>(path);
  if (stored === null) return seed; // transient error — never overwrite
  if (stored.length === 0 && seed.length > 0) {
    try {
      await writeBlob(path, seed);
    } catch {
      /* blob not reachable yet */
    }
    return seed;
  }
  return stored;
}

function articleWithDefaults(a: object): Article {
  const art = a as Article;
  return {
    ...art,
    tags: art.tags ?? [],
    faqs: art.faqs ?? [],
    status: art.status ?? "published",
    author: art.author || "Bond",
  };
}

export async function getArticles(): Promise<Article[]> {
  const list = await getCollection<Article>(
    ARTICLES_PATH,
    (articlesData as object[]).map(articleWithDefaults)
  );
  return list
    .map(articleWithDefaults)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

/** Published articles only — for every public page */
export async function getPublishedArticles(): Promise<Article[]> {
  return (await getArticles()).filter((a) => a.status === "published");
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  return (await getArticles()).find((a) => a.id === id);
}

export async function saveArticle(article: Article): Promise<void> {
  const articles = await getArticles();
  const idx = articles.findIndex((a) => a.id === article.id);
  if (idx >= 0) {
    articles[idx] = article;
  } else {
    articles.push(article);
  }
  await writeBlob(ARTICLES_PATH, articles);
}

export async function deleteArticle(id: string): Promise<void> {
  const articles = (await getArticles()).filter((a) => a.id !== id);
  await writeBlob(ARTICLES_PATH, articles);
}

export async function getFaqs(): Promise<Faq[]> {
  return getCollection<Faq>(FAQS_PATH, faqsData as Faq[]);
}

/** FAQs are reordered as a whole list in the admin panel */
export async function saveFaqs(faqs: Faq[]): Promise<void> {
  await writeBlob(FAQS_PATH, faqs);
}

export async function getReviews(): Promise<Review[]> {
  return (await getCollection<Review>(REVIEWS_PATH, reviewsData as Review[])).map(
    (r) => ({ ...r, rating: r.rating ?? 5, featured: r.featured ?? true })
  );
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  await writeBlob(REVIEWS_PATH, reviews);
}

export async function getSettings(): Promise<SiteSettings> {
  const baseUrl = getBlobBaseUrl();
  if (!baseUrl) return DEFAULT_SETTINGS;
  try {
    const res = await fetch(`${baseUrl}/${SETTINGS_PATH}`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...((await res.json()) as Partial<SiteSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await put(SETTINGS_PATH, JSON.stringify(settings), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}
