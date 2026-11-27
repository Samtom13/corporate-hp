import { getTourById, saveTour, deleteTour, renameTour } from "@/lib/db";
import type { Tour } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/adminAuth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  if (!(await isAdmin())) return unauthorized();
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
  if (!(await isAdmin())) return unauthorized();
  try {
    const { id } = await params;
    const body = (await request.json()) as Tour;

    const nextId = (body.id ?? "").trim();
    if (!nextId) {
      return Response.json({ error: "A URL slug is required" }, { status: 400 });
    }
    if (!/^[a-z0-9-]+$/.test(nextId)) {
      return Response.json(
        { error: "The URL slug may only use lowercase letters, numbers and hyphens" },
        { status: 400 }
      );
    }

    // Moving to a new slug keeps the old one as a redirect, so existing links
    // and anything already indexed stay alive.
    if (nextId !== id) {
      const result = await renameTour(id, { ...body, id: nextId });
      if (!result.ok) {
        return result.reason === "taken"
          ? Response.json({ error: "Another listing already uses that URL slug" }, { status: 409 })
          : Response.json({ error: "Not found" }, { status: 404 });
      }
      return Response.json({ success: true, id: nextId, redirectedFrom: id });
    }

    // The editor does not carry previousIds, so keep what is stored: a plain
    // save must not wipe the redirects from earlier renames.
    const existing = await getTourById(id);
    await saveTour({ ...body, id, previousIds: existing?.previousIds ?? [] });
    return Response.json({ success: true, id });
  } catch (e) {
    console.error("PUT listing error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const { id } = await params;
    await deleteTour(id);
    return Response.json({ success: true });
  } catch (e) {
    console.error("DELETE listing error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
