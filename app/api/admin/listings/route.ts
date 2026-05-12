import { getTours, saveTour } from "@/lib/db";
import type { Tour } from "@/lib/db";

export async function GET() {
  try {
    return Response.json(await getTours());
  } catch (e) {
    console.error("GET listings error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Tour;
    if (!body.id || !body.title) {
      return Response.json({ error: "id and title are required" }, { status: 400 });
    }
    await saveTour(body);
    return Response.json({ success: true });
  } catch (e) {
    console.error("POST listing error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
