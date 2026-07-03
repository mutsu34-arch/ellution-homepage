import { buildRssFeed } from "@/lib/rss";
import { getResolvedPublishedList } from "@/lib/posts-store";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export async function GET() {
  const siteUrl = getSiteUrl();
  const posts = await getResolvedPublishedList();
  const xml = buildRssFeed(posts, siteUrl);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
