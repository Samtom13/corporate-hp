import { deleteArticle, getArticleById, saveArticle } from "@/lib/db";
import type { Article } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/adminAuth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(article);
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const { id } = await params;
    const body = (await request.json()) as Article;
    if (!body.title) {
      return Response.json({ error: "title is required" }, { status: 400 });
    }
    // Slug changed → remove the old entry so no stale URL is left behind
    if (body.id && body.id !== id) {
      await deleteArticle(id);
    }
    await saveArticle({
      ...body,
      id: body.id || id,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    return Response.json({ success: true });
  } catch (e) {
    console.error("PUT article error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const { id } = await params;
    await deleteArticle(id);
    return Response.json({ success: true });
  } catch (e) {
    console.error("DELETE article error:", e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
}
