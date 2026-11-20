import { getSettings, saveSettings, DEFAULT_SETTINGS } from "@/lib/db";
import type { SiteSettings } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/adminAuth";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return Response.json(await getSettings());
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const body = (await request.json()) as Partial<SiteSettings>;
    const rating = Number(body.reviewRating);
    const count = Number(body.reviewCount);
    await saveSettings({
      reviewRating:
        Number.isFinite(rating) && rating > 0 && rating <= 5
          ? Math.round(rating * 10) / 10
          : DEFAULT_SETTINGS.reviewRating,
      reviewCount:
        Number.isFinite(count) && count >= 0
          ? Math.round(count)
          : DEFAULT_SETTINGS.reviewCount,
    });
    return Response.json({ success: true });
  } catch (e) {
    console.error("PUT settings error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
