import { getBookingById, saveBooking } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(booking);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const booking = getBookingById(id);
  if (!booking) return Response.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  saveBooking({ ...booking, ...body, id });
  return Response.json({ success: true });
}
