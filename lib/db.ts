import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const TOURS_FILE = path.join(DATA_DIR, "tours.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

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

function read<T>(file: string): T[] {
  try {
    const raw = fs.readFileSync(file, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function write<T>(file: string, data: T[]): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Read-only filesystem in production (Vercel) — skip silently
  }
}

// Tours
export function getTours(): Tour[] {
  return read<Tour>(TOURS_FILE);
}

export function getTourById(id: string): Tour | undefined {
  return getTours().find((t) => t.id === id);
}

export function saveTour(tour: Tour): void {
  const tours = getTours();
  const idx = tours.findIndex((t) => t.id === tour.id);
  if (idx >= 0) {
    tours[idx] = tour;
  } else {
    tours.push(tour);
  }
  write(TOURS_FILE, tours);
}

export function deleteTour(id: string): void {
  const tours = getTours().filter((t) => t.id !== id);
  write(TOURS_FILE, tours);
}

// Bookings
export function getBookings(): Booking[] {
  return read<Booking>(BOOKINGS_FILE);
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find((b) => b.id === id);
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    bookings[idx] = booking;
  } else {
    bookings.unshift(booking); // newest first
  }
  write(BOOKINGS_FILE, bookings);
}
