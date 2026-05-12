import { getTourById, saveTour, deleteTour } from "@/lib/db";
import type { Tour } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const tour = await getTourById(id);
    if (!tour) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(tour);
  } catch (e) {
    console.error("GET listing error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json() as Tour;
    await saveTour({ ...body, id });
    return Response.json({ success: true });
  } catch (e) {
    console.error("PUT listing error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await deleteTour(id);
    return Response.json({ success: true });
  } catch (e) {
    console.error("DELETE listing error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
