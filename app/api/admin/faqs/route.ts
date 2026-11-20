import { getFaqs, saveFaqs } from "@/lib/db";
import type { Faq } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/adminAuth";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    return Response.json(await getFaqs());
  } catch (e) {
    console.error("GET faqs error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

/** The admin panel saves the whole list at once, so order is preserved. */
export async function PUT(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const body = (await request.json()) as Faq[];
    if (!Array.isArray(body)) {
      return Response.json({ error: "Expected an array of FAQs" }, { status: 400 });
    }
    const cleaned = body
      .map((f, i) => ({
        id: f.id || `faq-${i + 1}`,
        question: (f.question ?? "").trim(),
        answer: (f.answer ?? "").trim(),
      }))
      .filter((f) => f.question && f.answer);
    await saveFaqs(cleaned);
    return Response.json({ success: true, count: cleaned.length });
  } catch (e) {
    console.error("PUT faqs error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
