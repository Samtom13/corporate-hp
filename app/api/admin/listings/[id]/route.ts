import { getTourById, saveTour, deleteTour } from "@/lib/db";
import type { Tour } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const tour = getTourById(id);
  if (!tour) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(tour);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json() as Tour;
  saveTour({ ...body, id });
  return Response.json({ success: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  deleteTour(id);
  return Response.json({ success: true });
}
