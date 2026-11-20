import Link from "next/link";
import { getArticles } from "@/lib/db";
import { formatDate, readingMinutes } from "@/lib/markdown";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await getArticles();
  const published = articles.filter((a) => a.status === "published");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-light text-[#1A1A1A]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Articles
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            {published.length} published · {articles.length - published.length} draft
            {articles.length - published.length === 1 ? "" : "s"} · live at{" "}
            <Link href="/blog" target="_blank" className="text-[#016812] hover:underline">
              /blog
            </Link>
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-6 py-3 bg-[#016812] text-white text-xs tracking-widest uppercase hover:bg-[#014010] transition-colors"
        >
          + New Article
        </Link>
      </div>

      <div className="bg-white border border-stone-100">
        {articles.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-stone-400 text-sm mb-2">No articles yet.</p>
            <p className="text-stone-400 text-xs mb-5 max-w-md mx-auto leading-relaxed">
              Articles are how go-bond.jp gets found for questions travelers actually type —
              and what AI assistants quote when someone asks about Kyoto.
            </p>
            <Link href="/admin/articles/new" className="text-xs text-[#016812] hover:underline">
              Write your first article →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100">
                {["", "Title", "Date", "Length", "Status", ""].map((h, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 text-left text-xs tracking-widest uppercase text-stone-400 font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-stone-50 hover:bg-stone-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {article.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.coverImage}
                        alt=""
                        className="w-14 h-10 object-cover"
                      />
                    ) : (
                      <div className="w-14 h-10 bg-stone-100" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#1A1A1A]">{article.title}</p>
                    <p className="text-xs text-stone-400">/blog/{article.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500 whitespace-nowrap">
                    {formatDate(article.publishedAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500 whitespace-nowrap">
                    {readingMinutes(article.body)} min
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        article.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-xs text-[#016812] hover:underline mr-4"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/blog/${article.id}`}
                      target="_blank"
                      className="text-xs text-stone-400 hover:text-stone-600"
                    >
                      View ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
