import { cache } from "react";
import { getPublishedArticles } from "@/lib/db";

/**
 * Request-level memoized article list. Nav and Footer both need to know
 * whether the journal has anything in it, so they share one blob read.
 */
export const publishedArticles = cache(getPublishedArticles);

export const hasPublishedArticles = cache(async (): Promise<boolean> => {
  try {
    return (await publishedArticles()).length > 0;
  } catch {
    return false;
  }
});
