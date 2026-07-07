/** 유입 경로·검색어 파싱 (클라이언트·서버 공용) */

export type ParsedTraffic = {
  sourceKey: string;
  sourceLabel: string;
  medium: string;
  searchKeyword?: string;
  referrerHost?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
};

const SEARCH_ENGINES: { hosts: string[]; key: string; label: string; queryParams: string[] }[] = [
  { hosts: ["google.co.kr", "google.com", "www.google.com"], key: "google", label: "Google", queryParams: ["q"] },
  { hosts: ["search.naver.com", "naver.com", "www.naver.com", "m.search.naver.com"], key: "naver", label: "Naver", queryParams: ["query", "oquery", "q"] },
  { hosts: ["search.daum.net", "daum.net", "www.daum.net"], key: "daum", label: "Daum", queryParams: ["q", "w"] },
  { hosts: ["bing.com", "www.bing.com"], key: "bing", label: "Bing", queryParams: ["q"] },
  { hosts: ["search.yahoo.com", "yahoo.com"], key: "yahoo", label: "Yahoo", queryParams: ["p", "q"] },
];

const SOCIAL_HOSTS: { pattern: RegExp; key: string; label: string }[] = [
  { pattern: /(^|\.)facebook\.com$/i, key: "facebook", label: "Facebook" },
  { pattern: /(^|\.)instagram\.com$/i, key: "instagram", label: "Instagram" },
  { pattern: /(^|\.)twitter\.com$|(^|\.)x\.com$/i, key: "twitter", label: "X (Twitter)" },
  { pattern: /(^|\.)youtube\.com$/i, key: "youtube", label: "YouTube" },
  { pattern: /(^|\.)t\.co$/i, key: "twitter", label: "X (Twitter)" },
  { pattern: /(^|\.)threads\.net$/i, key: "threads", label: "Threads" },
];

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, "");
}

function hostsMatch(host: string, candidates: string[]): boolean {
  const h = normalizeHost(host);
  return candidates.some((c) => h === normalizeHost(c) || h.endsWith(`.${normalizeHost(c)}`));
}

function extractKeyword(url: URL, paramNames: string[]): string | undefined {
  for (const name of paramNames) {
    const value = url.searchParams.get(name)?.trim();
    if (value) return value;
  }
  return undefined;
}

function parseReferrer(referrer: string, siteHosts: string[]): ParsedTraffic | null {
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();

    if (siteHosts.some((site) => host === site || host.endsWith(`.${site}`))) {
      return null;
    }

    for (const engine of SEARCH_ENGINES) {
      if (hostsMatch(host, engine.hosts)) {
        const keyword = extractKeyword(url, engine.queryParams);
        return {
          sourceKey: engine.key,
          sourceLabel: engine.label,
          medium: "organic",
          searchKeyword: keyword,
          referrerHost: host,
        };
      }
    }

    for (const social of SOCIAL_HOSTS) {
      if (social.pattern.test(host)) {
        return {
          sourceKey: social.key,
          sourceLabel: social.label,
          medium: "social",
          referrerHost: host,
        };
      }
    }

    return {
      sourceKey: `ref:${host}`,
      sourceLabel: host,
      medium: "referral",
      referrerHost: host,
    };
  } catch {
    return null;
  }
}

function parseUtm(search: string): Partial<ParsedTraffic> {
  try {
    const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
    const utmSource = params.get("utm_source")?.trim() || undefined;
    const utmMedium = params.get("utm_medium")?.trim() || undefined;
    const utmCampaign = params.get("utm_campaign")?.trim() || undefined;
    const utmTerm = params.get("utm_term")?.trim() || undefined;

    if (!utmSource && !utmMedium && !utmCampaign && !utmTerm) {
      return {};
    }

    const medium = utmMedium || "campaign";
    const sourceLabel = utmSource
      ? utmSource.charAt(0).toUpperCase() + utmSource.slice(1)
      : "UTM";

    return {
      sourceKey: utmSource ? `utm:${utmSource.toLowerCase()}` : "utm:unknown",
      sourceLabel,
      medium,
      searchKeyword: utmTerm,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
    };
  } catch {
    return {};
  }
}

export function getSiteHosts(): string[] {
  const hosts = new Set<string>(["ellution.co.kr", "www.ellution.co.kr", "localhost"]);
  try {
    const fromEnv = process.env.NEXTAUTH_URL || process.env.SITE_URL;
    if (fromEnv) {
      hosts.add(new URL(fromEnv).hostname.toLowerCase());
    }
  } catch {
    // ignore
  }
  return Array.from(hosts);
}

/** referrer·UTM·현재 URL 검색어를 종합해 유입 경로를 파싱합니다. */
export function parseTraffic(input: {
  referrer?: string;
  landingSearch?: string;
  siteHosts?: string[];
}): ParsedTraffic {
  const siteHosts = input.siteHosts ?? getSiteHosts();
  const utm = input.landingSearch ? parseUtm(input.landingSearch) : {};

  if (utm.sourceKey) {
    return {
      sourceKey: utm.sourceKey,
      sourceLabel: utm.sourceLabel ?? "UTM",
      medium: utm.medium ?? "campaign",
      searchKeyword: utm.searchKeyword,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      utmTerm: utm.utmTerm,
      referrerHost: input.referrer
        ? (() => {
            try {
              return new URL(input.referrer).hostname;
            } catch {
              return undefined;
            }
          })()
        : undefined,
    };
  }

  if (input.referrer) {
    const fromRef = parseReferrer(input.referrer, siteHosts);
    if (fromRef) return fromRef;
  }

  return {
    sourceKey: "direct",
    sourceLabel: "직접 입력 / 북마크",
    medium: "none",
  };
}

export function mediumLabel(medium: string): string {
  switch (medium) {
    case "organic":
      return "검색";
    case "social":
      return "SNS";
    case "referral":
      return "외부 링크";
    case "cpc":
    case "paid":
      return "광고";
    case "campaign":
      return "캠페인";
    case "none":
      return "직접";
    default:
      return medium;
  }
}

export function resolveTrafficFromRecord(record: {
  referrer?: string;
  isEntry?: boolean;
  sourceKey?: string;
  sourceLabel?: string;
  medium?: string;
  searchKeyword?: string;
  referrerHost?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  landingSearch?: string;
}): ParsedTraffic {
  if (record.sourceKey && record.sourceLabel) {
    return {
      sourceKey: record.sourceKey,
      sourceLabel: record.sourceLabel,
      medium: record.medium ?? "referral",
      searchKeyword: record.searchKeyword,
      referrerHost: record.referrerHost,
      utmSource: record.utmSource,
      utmMedium: record.utmMedium,
      utmCampaign: record.utmCampaign,
      utmTerm: record.utmTerm,
    };
  }

  return parseTraffic({
    referrer: record.referrer,
    landingSearch: record.landingSearch,
  });
}

const SESSION_GAP_MS = 30 * 60 * 1000;

/** 세션 첫 페이지뷰(유입 집계용)만 추출합니다. */
export function pickSessionEntryViews<T extends { visitorId: string; startedAt: string; durationSec?: number }>(
  records: T[],
): T[] {
  const sorted = [...records].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  const entries: T[] = [];
  const sessionEnd = new Map<string, number>();

  for (const row of sorted) {
    const t = new Date(row.startedAt).getTime();
    const last = sessionEnd.get(row.visitorId);
    if (last == null || t - last > SESSION_GAP_MS) {
      entries.push(row);
    }
    sessionEnd.set(row.visitorId, t + (row.durationSec ?? 0) * 1000);
  }

  return entries;
}
