import "server-only";
import { getDb } from "./firebase-admin";
import { kstPeriodStartIso, toKstDateString } from "./analytics-kst";
import {
  pickSessionEntryViews,
  resolveTrafficFromRecord,
} from "./analytics-referrer";

const COLLECTION = "analytics_views";

export type AnalyticsViewRecord = {
  viewId: string;
  visitorId: string;
  path: string;
  title: string;
  articleSlug?: string;
  referrer?: string;
  isEntry?: boolean;
  landingSearch?: string;
  sourceKey?: string;
  sourceLabel?: string;
  medium?: string;
  searchKeyword?: string;
  referrerHost?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
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
  sourceLabel?: string;
  medium?: string;
  searchKeyword?: string;
};

export type AnalyticsSourceStat = {
  sourceKey: string;
  sourceLabel: string;
  medium: string;
  entries: number;
  uniqueVisitors: number;
};

export type AnalyticsKeywordStat = {
  keyword: string;
  sourceLabel: string;
  entries: number;
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
  /** 조회 기록이 있는 모든 칼럼(상위 제한 없음) */
  allArticles: AnalyticsArticleStat[];
  topSources: AnalyticsSourceStat[];
  topKeywords: AnalyticsKeywordStat[];
  recentViews: AnalyticsRecentView[];
};

export async function recordPageView(input: {
  viewId: string;
  visitorId: string;
  path: string;
  title: string;
  articleSlug?: string;
  referrer?: string;
  isEntry?: boolean;
  landingSearch?: string;
  sourceKey?: string;
  sourceLabel?: string;
  medium?: string;
  searchKeyword?: string;
  referrerHost?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
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
    isEntry: input.isEntry,
    landingSearch: input.landingSearch,
    sourceKey: input.sourceKey,
    sourceLabel: input.sourceLabel,
    medium: input.medium,
    searchKeyword: input.searchKeyword,
    referrerHost: input.referrerHost,
    utmSource: input.utmSource,
    utmMedium: input.utmMedium,
    utmCampaign: input.utmCampaign,
    utmTerm: input.utmTerm,
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
    allArticles: [],
    topSources: [],
    topKeywords: [],
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

  const allArticles: AnalyticsArticleStat[] = Array.from(articleMap.values())
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      views: a.views,
      uniqueVisitors: a.visitors.size,
      avgDurationSec: avgDuration(a.totalDuration, a.durationCount),
    }))
    .sort((a, b) => b.views - a.views);

  const topArticles: AnalyticsArticleStat[] = allArticles.slice(0, 15);

  const sessionEntryIds = new Set(pickSessionEntryViews(records).map((row) => row.viewId));

  const recentViews: AnalyticsRecentView[] = records.slice(0, 20).map((row) => {
    const isSessionEntry = sessionEntryIds.has(row.viewId);
    const traffic = isSessionEntry ? resolveTrafficFromRecord(row) : null;
    return {
      path: row.path,
      title: row.title,
      visitorId: row.visitorId,
      durationSec: row.durationSec,
      startedAt: row.startedAt,
      sourceLabel: traffic?.sourceLabel,
      medium: traffic?.medium,
      searchKeyword: traffic?.searchKeyword,
    };
  });

  const entryViews = pickSessionEntryViews(records);
  const sourceMap = new Map<
    string,
    { sourceKey: string; sourceLabel: string; medium: string; visitors: Set<string>; entries: number }
  >();
  const keywordMap = new Map<string, { keyword: string; sourceLabel: string; entries: number }>();

  for (const row of entryViews) {
    const traffic = resolveTrafficFromRecord(row);
    const sourceKey = traffic.sourceKey;

    let sourceEntry = sourceMap.get(sourceKey);
    if (!sourceEntry) {
      sourceEntry = {
        sourceKey: traffic.sourceKey,
        sourceLabel: traffic.sourceLabel,
        medium: traffic.medium,
        visitors: new Set<string>(),
        entries: 0,
      };
      sourceMap.set(sourceKey, sourceEntry);
    }
    sourceEntry.visitors.add(row.visitorId);
    sourceEntry.entries += 1;

    const keyword = traffic.searchKeyword?.trim();
    if (keyword) {
      const kwKey = `${traffic.sourceLabel}::${keyword.toLowerCase()}`;
      const kwEntry = keywordMap.get(kwKey) ?? {
        keyword,
        sourceLabel: traffic.sourceLabel,
        entries: 0,
      };
      kwEntry.entries += 1;
      keywordMap.set(kwKey, kwEntry);
    }
  }

  const topSources: AnalyticsSourceStat[] = Array.from(sourceMap.values())
    .map((s) => ({
      sourceKey: s.sourceKey,
      sourceLabel: s.sourceLabel,
      medium: s.medium,
      entries: s.entries,
      uniqueVisitors: s.visitors.size,
    }))
    .sort((a, b) => b.entries - a.entries)
    .slice(0, 12);

  const topKeywords: AnalyticsKeywordStat[] = Array.from(keywordMap.values())
    .sort((a, b) => b.entries - a.entries)
    .slice(0, 15);

  return {
    configured: true,
    periodDays,
    uniqueVisitors: allVisitors.size,
    pageViews: records.length,
    avgDurationSec: avgDuration(totalDuration, durationCount),
    daily,
    topPages,
    topArticles,
    allArticles,
    topSources,
    topKeywords,
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
