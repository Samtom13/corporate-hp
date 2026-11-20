import { getReviews, saveReviews } from "@/lib/db";
import type { Review } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/adminAuth";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    return Response.json(await getReviews());
  } catch (e) {
    console.error("GET reviews error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

/** The admin panel saves the whole list at once, so order is preserved. */
export async function PUT(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const body = (await request.json()) as Review[];
    if (!Array.isArray(body)) {
      return Response.json({ error: "Expected an array of reviews" }, { status: 400 });
    }
    const cleaned = body
      .map((r, i) => ({
        id: r.id || `review-${i + 1}`,
        name: (r.name ?? "").trim(),
        country: (r.country ?? "").trim(),
        platform: (r.platform ?? "").trim(),
        text: (r.text ?? "").trim(),
        rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
        featured: r.featured !== false,
      }))
      .filter((r) => r.name && r.text);
    await saveReviews(cleaned);
    return Response.json({ success: true, count: cleaned.length });
  } catch (e) {
    console.error("PUT reviews error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
