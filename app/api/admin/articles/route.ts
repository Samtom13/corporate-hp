import { getArticles, saveArticle } from "@/lib/db";
import type { Article } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/adminAuth";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  try {
    return Response.json(await getArticles());
  } catch (e) {
    console.error("GET articles error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const body = (await request.json()) as Article;
    if (!body.id || !body.title) {
      return Response.json({ error: "slug and title are required" }, { status: 400 });
    }
    const existing = await getArticles();
    if (existing.some((a) => a.id === body.id)) {
      return Response.json(
        { error: `An article with the slug "${body.id}" already exists` },
        { status: 409 }
      );
    }
    await saveArticle({ ...body, updatedAt: new Date().toISOString().slice(0, 10) });
    return Response.json({ success: true });
  } catch (e) {
    console.error("POST article error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
