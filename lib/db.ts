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
  whatsapp?: string;
  guests: string;
  date?: string;
  flexibleDates: boolean;
  selectedTour?: string;
  selectedInterests: string[];
  requests?: string;
  status: "new" | "contacted" | "confirmed" | "cancelled";
};

const BLOB_BASE = "https://blob.vercel-storage.com";
const TOURS_PATH = "bond-data/tours.json";
const BOOKINGS_PATH = "bond-data/bookings.json";

function withDefaults(t: object): Tour {
  return {
    ...({ pricing: [], includes: [], excludes: [], beforeYouBook: [] } as unknown as Tour),
    ...(t as Tour),
  };
}

function getToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN ?? null;
}

/** Find the blob URL for a given pathname via the list API */
async function getBlobUrl(pathname: string): Promise<string | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(
      `${BLOB_BASE}?prefix=${encodeURIComponent(pathname)}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const { blobs } = await res.json() as { blobs: { pathname: string; url: string }[] };
    return blobs.find((b) => b.pathname === pathname)?.url ?? null;
  } catch {
    return null;
  }
}

/** Read JSON array from Vercel Blob */
async function readBlob<T>(pathname: string): Promise<T[] | null> {
  const url = await getBlobUrl(pathname);
  if (!url) return null;
  try {
    // fetch with Authorization bypasses CDN cache
    const token = getToken()!;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json() as T[];
  } catch {
    return null;
  }
}

/** Write JSON array to Vercel Blob (overwrites same path) */
async function writeBlob<T>(pathname: string, data: T[]): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN not set");
  const res = await fetch(`${BLOB_BASE}/${pathname}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Blob write failed ${res.status}: ${text}`);
  }
}

// ── Tours ──────────────────────────────────────────────

export async function getTours(): Promise<Tour[]> {
  const stored = await readBlob<Tour>(TOURS_PATH);
  if (stored && stored.length > 0) return stored;
  // First run: seed from bundled static JSON
  const seed = (toursData as object[]).map(withDefaults);
  try {
    await writeBlob(TOURS_PATH, seed);
  } catch {
    // Token not set in local dev — return static data as read-only
  }
  return seed;
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
