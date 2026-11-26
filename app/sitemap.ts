import type { MetadataRoute } from "next";
import { getTours, getPublishedArticles } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

// Articles are published from the admin panel, so the sitemap must be built per request
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, articles] = await Promise.all([getTours(), getPublishedArticles()]);

  const tourEntries: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: `${SITE_URL}/tour/${tour.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.id}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // The journal index is only listed once something is published there
  const blogIndex: MetadataRoute.Sitemap =
    articles.length > 0
      ? [
          {
            url: `${SITE_URL}/blog`,
            lastModified: new Date(articles[0].updatedAt || articles[0].publishedAt),
            changeFrequency: "weekly",
            priority: 0.8,
          },
        ]
      : [];

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/booking`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      // 撮影サービスLP。別プロジェクトを next.config.ts のリライトで配信している
      url: `${SITE_URL}/photo`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...blogIndex,
    ...tourEntries,
    ...articleEntries,
  ];
}
