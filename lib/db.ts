import { kv } from "@vercel/kv";
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

const TOURS_KEY = "bond:tours";
const BOOKINGS_KEY = "bond:bookings";

function withDefaults(t: object): Tour {
  return {
    ...({ pricing: [], includes: [], excludes: [], beforeYouBook: [] } as unknown as Tour),
    ...(t as Tour),
  };
}

// Tours
export async function getTours(): Promise<Tour[]> {
  try {
    const stored = await kv.get<Tour[]>(TOURS_KEY);
    if (stored && stored.length > 0) return stored;
    // Seed from bundled JSON on first run
    const seed = (toursData as object[]).map(withDefaults);
    await kv.set(TOURS_KEY, seed);
    return seed;
  } catch {
    // KV not configured — fall back to static JSON (read-only)
    return (toursData as object[]).map(withDefaults);
  }
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
  await kv.set(TOURS_KEY, tours);
}

export async function deleteTour(id: string): Promise<void> {
  const tours = (await getTours()).filter((t) => t.id !== id);
  await kv.set(TOURS_KEY, tours);
}

// Bookings
export async function getBookings(): Promise<Booking[]> {
  try {
    return (await kv.get<Booking[]>(BOOKINGS_KEY)) ?? [];
  } catch {
    return [];
  }
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
  await kv.set(BOOKINGS_KEY, bookings);
}
