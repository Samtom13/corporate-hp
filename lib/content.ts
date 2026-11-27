import { cache } from "react";
import { getPublishedArticles, getTours, getSettings } from "@/lib/db";
import { sitePriceRange } from "@/lib/site";

/**
 * Request-level memoized reads. Several components on one page need the same
 * data (Nav and Footer both ask whether the journal has anything in it; every
 * page needs the rating and price range for the Organization node), so they
 * share one blob read instead of repeating it.
 */
export const publishedArticles = cache(getPublishedArticles);
export const siteTours = cache(getTours);
export const siteSettings = cache(getSettings);

export const hasPublishedArticles = cache(async (): Promise<boolean> => {
  try {
    return (await publishedArticles()).length > 0;
  } catch {
    return false;
  }
});

/**
 * Rating, review count and price range for the Organization JSON-LD, so every
 * page states the same numbers as the listings themselves.
 */
export const organizationFacts = cache(async () => {
  const [settings, tours] = await Promise.all([siteSettings(), siteTours()]);
  return {
    rating: settings.reviewRating,
    count: settings.reviewCount,
    priceRange: sitePriceRange(tours),
  };
});
