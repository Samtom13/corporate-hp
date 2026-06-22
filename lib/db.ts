import { put } from "@vercel/blob";
import toursData from "@/data/tours.json";

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
