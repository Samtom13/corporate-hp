import { getBookingById, saveBooking } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/adminAuth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(booking);
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) return Response.json({ error: "Not found" }, { status: 404 });
  const body = await request.json();
  await saveBooking({ ...booking, ...body, id });
  return Response.json({ success: true });
}
