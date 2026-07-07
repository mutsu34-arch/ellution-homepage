import "server-only";
import { getDb } from "./firebase-admin";
import { kstPeriodStartIso, toKstDateString } from "./analytics-kst";

const COLLECTION = "analytics_views";

export type AnalyticsViewRecord = {
  viewId: string;
  visitorId: string;
  path: string;
  title: string;
  articleSlug?: string;
  referrer?: string;
  startedAt: string;
  endedAt?: string;
  durationSec?: number;
  dateKst: string;
};

export type AnalyticsPageStat = {
  path: string;
  title: string;
  articleSlug?: string;
  views: number;
  uniqueVisitors: number;
  avgDurationSec: number;
  totalDurationSec: number;
};

export type AnalyticsArticleStat = {
  slug: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  avgDurationSec: number;
};

export type AnalyticsDailyStat = {
  date: string;
  visitors: number;
  pageViews: number;
  avgDurationSec: number;
};

export type AnalyticsRecentView = {
  path: string;
  title: string;
  visitorId: string;
  durationSec?: number;
  startedAt: string;
};

export type AnalyticsSummary = {
  configured: boolean;
  periodDays: number;
  uniqueVisitors: number;
  pageViews: number;
  avgDurationSec: number;
  daily: AnalyticsDailyStat[];
  topPages: AnalyticsPageStat[];
  topArticles: AnalyticsArticleStat[];
  recentViews: AnalyticsRecentView[];
};

export async function recordPageView(input: {
  viewId: string;
  visitorId: string;
  path: string;
  title: string;
  articleSlug?: string;
  referrer?: string;
}): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("FIREBASE_NOT_CONFIGURED");

  const startedAt = new Date().toISOString();
  const payload: AnalyticsViewRecord = {
    viewId: input.viewId,
    visitorId: input.visitorId,
    path: input.path,
    title: input.title,
    articleSlug: input.articleSlug,
    referrer: input.referrer,
    startedAt,
    dateKst: toKstDateString(startedAt),
  };

  await db.collection(COLLECTION).doc(input.viewId).set(payload, { merge: false });
}

export async function recordDuration(input: {
  viewId: string;
  visitorId: string;
  durationSec: number;
}): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("FIREBASE_NOT_CONFIGURED");

  const ref = db.collection(COLLECTION).doc(input.viewId);
  const snap = await ref.get();
  if (!snap.exists) return;

  const data = snap.data() as AnalyticsViewRecord;
  if (data.visitorId !== input.visitorId) return;

  await ref.set(
    {
      endedAt: new Date().toISOString(),
      durationSec: Math.round(input.durationSec),
    },
    { merge: true },
  );
}

function avgDuration(total: number, count: number): number {
  return count > 0 ? Math.round(total / count) : 0;
}

export async function getAnalyticsSummary(periodDays: number): Promise<AnalyticsSummary> {
  const empty: AnalyticsSummary = {
    configured: false,
    periodDays,
    uniqueVisitors: 0,
    pageViews: 0,
    avgDurationSec: 0,
    daily: [],
    topPages: [],
    topArticles: [],
    recentViews: [],
  };

  const db = getDb();
  if (!db) return empty;

  const startIso = kstPeriodStartIso(periodDays);
  let records: AnalyticsViewRecord[] = [];

  try {
    const snap = await db
      .collection(COLLECTION)
      .where("startedAt", ">=", startIso)
      .orderBy("startedAt", "desc")
      .limit(8000)
      .get();

    records = snap.docs.map((doc) => doc.data() as AnalyticsViewRecord);
  } catch (e) {
    console.error("[analytics-store] query error:", e);
    return { ...empty, configured: true };
  }

  const allVisitors = new Set<string>();
  let totalDuration = 0;
  let durationCount = 0;

  const dailyMap = new Map<
    string,
    { visitors: Set<string>; pageViews: number; totalDuration: number; durationCount: number }
  >();
  const pageMap = new Map<
    string,
    {
      path: string;
      title: string;
      articleSlug?: string;
      visitors: Set<string>;
      views: number;
      totalDuration: number;
      durationCount: number;
    }
  >();
  const articleMap = new Map<
    string,
    {
      slug: string;
      title: string;
      visitors: Set<string>;
      views: number;
      totalDuration: number;
      durationCount: number;
    }
  >();

  for (const row of records) {
    allVisitors.add(row.visitorId);

    let dayEntry = dailyMap.get(row.dateKst);
    if (!dayEntry) {
      dayEntry = { visitors: new Set<string>(), pageViews: 0, totalDuration: 0, durationCount: 0 };
      dailyMap.set(row.dateKst, dayEntry);
    }
    dayEntry.visitors.add(row.visitorId);
    dayEntry.pageViews += 1;
    if (row.durationSec != null && row.durationSec > 0) {
      dayEntry.totalDuration += row.durationSec;
      dayEntry.durationCount += 1;
      totalDuration += row.durationSec;
      durationCount += 1;
    }

    let pageEntry = pageMap.get(row.path);
    if (!pageEntry) {
      pageEntry = {
        path: row.path,
        title: row.title,
        articleSlug: row.articleSlug,
        visitors: new Set<string>(),
        views: 0,
        totalDuration: 0,
        durationCount: 0,
      };
      pageMap.set(row.path, pageEntry);
    }
    pageEntry.title = row.title || pageEntry.title;
    pageEntry.articleSlug = row.articleSlug ?? pageEntry.articleSlug;
    pageEntry.visitors.add(row.visitorId);
    pageEntry.views += 1;
    if (row.durationSec != null && row.durationSec > 0) {
      pageEntry.totalDuration += row.durationSec;
      pageEntry.durationCount += 1;
    }

    if (row.articleSlug) {
      let articleEntry = articleMap.get(row.articleSlug);
      if (!articleEntry) {
        articleEntry = {
          slug: row.articleSlug,
          title: row.title,
          visitors: new Set<string>(),
          views: 0,
          totalDuration: 0,
          durationCount: 0,
        };
        articleMap.set(row.articleSlug, articleEntry);
      }
      articleEntry.title = row.title || articleEntry.title;
      articleEntry.visitors.add(row.visitorId);
      articleEntry.views += 1;
      if (row.durationSec != null && row.durationSec > 0) {
        articleEntry.totalDuration += row.durationSec;
        articleEntry.durationCount += 1;
      }
    }
  }

  const daily: AnalyticsDailyStat[] = Array.from(dailyMap.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, stat]) => ({
      date,
      visitors: stat.visitors.size,
      pageViews: stat.pageViews,
      avgDurationSec: avgDuration(stat.totalDuration, stat.durationCount),
    }));

  const topPages: AnalyticsPageStat[] = Array.from(pageMap.values())
    .map((p) => ({
      path: p.path,
      title: p.title,
      articleSlug: p.articleSlug,
      views: p.views,
      uniqueVisitors: p.visitors.size,
      avgDurationSec: avgDuration(p.totalDuration, p.durationCount),
      totalDurationSec: p.totalDuration,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 15);

  const topArticles: AnalyticsArticleStat[] = Array.from(articleMap.values())
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      views: a.views,
      uniqueVisitors: a.visitors.size,
      avgDurationSec: avgDuration(a.totalDuration, a.durationCount),
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 15);

  const recentViews: AnalyticsRecentView[] = records.slice(0, 20).map((row) => ({
    path: row.path,
    title: row.title,
    visitorId: row.visitorId,
    durationSec: row.durationSec,
    startedAt: row.startedAt,
  }));

  return {
    configured: true,
    periodDays,
    uniqueVisitors: allVisitors.size,
    pageViews: records.length,
    avgDurationSec: avgDuration(totalDuration, durationCount),
    daily,
    topPages,
    topArticles,
    recentViews,
  };
}

export function formatDurationSec(sec: number): string {
  if (sec <= 0) return "-";
  if (sec < 60) return `${sec}초`;
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  if (minutes < 60) return seconds > 0 ? `${minutes}분 ${seconds}초` : `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const remainMin = minutes % 60;
  return remainMin > 0 ? `${hours}시간 ${remainMin}분` : `${hours}시간`;
}

export function maskVisitorId(id: string): string {
  if (id.length <= 8) return id;
  return `${id.slice(0, 8)}…`;
}
