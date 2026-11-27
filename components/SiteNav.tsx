import Nav from "@/components/Nav";
import { hasPublishedArticles } from "@/lib/content";

/**
 * Server wrapper around Nav: the Journal link only appears once at least one
 * article is published, so visitors never land on an empty page.
 *
 * Pass `solid` on every page that opens on a light background (/faq, /blog,
 * the article pages, /booking). Without it the header renders white on white
 * and the logo, the links and the Request Experience button are invisible
 * until the visitor scrolls.
 */
export default async function SiteNav({ solid = false }: { solid?: boolean }) {
  return <Nav showJournal={await hasPublishedArticles()} solid={solid} />;
}
