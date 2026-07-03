import type { ResolvedListItem } from "./posts-store";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr: string): string {
  const date = new Date(`${dateStr}T09:00:00+09:00`);
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

export function buildRssFeed(
  posts: ResolvedListItem[],
  siteUrl: string,
  feedPath = "/feed.xml",
): string {
  const channelTitle = "엘루션(Ellution) 전문가 칼럼";
  const channelDescription =
    "행정법 수험 전략, 법률·부동산 실무 인사이트를 담은 엘루션 전문가 칼럼입니다.";
  const feedUrl = `${siteUrl}${feedPath}`;
  const blogUrl = `${siteUrl}/blog`;
  const lastBuildDate =
    posts.length > 0 ? toRfc822(posts[0].date) : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const categories =
        post.tags?.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n") ??
        "";

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${blogUrl}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}
