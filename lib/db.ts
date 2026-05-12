import { put, list } from "@vercel/blob";
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

const TOURS_PATH = "bond-data/tours.json";
const BOOKINGS_PATH = "bond-data/bookings.json";

function withDefaults(t: object): Tour {
  return {
    ...({ pricing: [], includes: [], excludes: [], beforeYouBook: [] } as unknown as Tour),
    ...(t as Tour),
  };
}

async function readBlob<T>(pathname: string): Promise<T[] | null> {
  try {
    const { blobs } = await list({ prefix: pathname });
    const blob = blobs.find((b) => b.pathname === pathname);
    if (!blob) return null;
    // Fetch with no cache to always get fresh data
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

async function writeBlob<T>(pathname: string, data: T[]): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 0, // no CDN caching — always serve fresh
  });
}

// Tours
export async function getTours(): Promise<Tour[]> {
  const stored = await readBlob<Tour>(TOURS_PATH);
  if (stored && stored.length > 0) return stored;
  // Seed from bundled JSON on first run
  const seed = (toursData as object[]).map(withDefaults);
  try {
    await writeBlob(TOURS_PATH, seed);
  } catch {
    // BLOB_READ_WRITE_TOKEN not set (local dev) — return static data
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

// Bookings
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
    bookings.unshift(booking); // newest first
  }
  await writeBlob(BOOKINGS_PATH, bookings);
}
