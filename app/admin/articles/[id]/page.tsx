import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/db";
import ArticleEditor from "@/components/admin/ArticleEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();
  return <ArticleEditor initial={article} />;
}
