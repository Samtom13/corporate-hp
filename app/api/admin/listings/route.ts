import { getTours, saveTour } from "@/lib/db";
import type { Tour } from "@/lib/db";

export async function GET() {
  return Response.json(await getTours());
}

export async function POST(request: Request) {
  const body = await request.json() as Tour;
  if (!body.id || !body.title) {
    return Response.json({ error: "id and title are required" }, { status: 400 });
  }
  await saveTour(body);
  return Response.json({ success: true });
}
