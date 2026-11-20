import Nav from "@/components/Nav";
import { hasPublishedArticles } from "@/lib/content";

/**
 * Server wrapper around Nav: the Journal link only appears once at least one
 * article is published, so visitors never land on an empty page.
 */
export default async function SiteNav() {
  return <Nav showJournal={await hasPublishedArticles()} />;
}
