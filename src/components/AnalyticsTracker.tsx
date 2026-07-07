"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { isAdminEmail } from "@/lib/admin";
import { parseTraffic } from "@/lib/analytics-referrer";

const VISITOR_KEY = "ellution_vid";
const SESSION_ENTRY_KEY = "ellution_entry_active";

function shouldSkipPath(path: string): boolean {
  if (path.startsWith("/api")) return true;
  if (path.startsWith("/login") || path.startsWith("/register")) return true;
  if (path.startsWith("/dashboard")) return true;
  if (path.startsWith("/blog/manage")) return true;
  if (path.includes("/edit")) return true;
  if (path.startsWith("/maintenance")) return true;
  return false;
}

function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID().replace(/-/g, "")
        : `v${Date.now()}${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return `v${Date.now()}`;
  }
}

function extractArticleSlug(path: string): string | undefined {
  const match = path.match(/^\/blog\/([^/]+)$/);
  if (!match) return undefined;
  const slug = match[1];
  if (slug === "manage") return undefined;
  return slug;
}

function isNewSessionEntry(): boolean {
  try {
    if (sessionStorage.getItem(SESSION_ENTRY_KEY)) return false;
    sessionStorage.setItem(SESSION_ENTRY_KEY, "1");
    return true;
  } catch {
    return true;
  }
}

async function sendTrack(payload: Record<string, unknown>): Promise<void> {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // 통계 실패는 사용자 경험에 영향을 주지 않음
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname() ?? "/";
  const { data: session } = useSession();
  const isAdmin = isAdminEmail(session?.user?.email);

  const viewIdRef = useRef<string | null>(null);
  const startedAtRef = useRef<number>(0);
  const visitorIdRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isAdmin || shouldSkipPath(pathname)) return;

    visitorIdRef.current = getVisitorId();

    const endPrevious = () => {
      const viewId = viewIdRef.current;
      const startedAt = startedAtRef.current;
      if (!viewId || !startedAt) return;

      const durationSec = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      void sendTrack({
        event: "duration",
        viewId,
        visitorId: visitorIdRef.current,
        durationSec,
      });
      viewIdRef.current = null;
      startedAtRef.current = 0;
    };

    endPrevious();

    const viewId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID().replace(/-/g, "")
        : `w${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

    viewIdRef.current = viewId;
    startedAtRef.current = Date.now();

    const isEntry = isNewSessionEntry();
    const landingSearch = isEntry ? window.location.search : undefined;
    const referrer = isEntry ? document.referrer || undefined : undefined;
    const traffic =
      isEntry
        ? parseTraffic({
            referrer,
            landingSearch,
            siteHosts: [window.location.hostname, "ellution.co.kr", "www.ellution.co.kr"],
          })
        : null;

    void sendTrack({
      event: "pageview",
      viewId,
      visitorId: visitorIdRef.current,
      path: pathname,
      title: document.title,
      articleSlug: extractArticleSlug(pathname),
      referrer,
      isEntry,
      landingSearch,
      ...(traffic
        ? {
            sourceKey: traffic.sourceKey,
            sourceLabel: traffic.sourceLabel,
            medium: traffic.medium,
            searchKeyword: traffic.searchKeyword,
            referrerHost: traffic.referrerHost,
            utmSource: traffic.utmSource,
            utmMedium: traffic.utmMedium,
            utmCampaign: traffic.utmCampaign,
            utmTerm: traffic.utmTerm,
          }
        : {}),
    });

    const onHide = () => {
      if (document.visibilityState === "hidden") endPrevious();
    };

    window.addEventListener("pagehide", endPrevious);
    document.addEventListener("visibilitychange", onHide);

    return () => {
      window.removeEventListener("pagehide", endPrevious);
      document.removeEventListener("visibilitychange", onHide);
      endPrevious();
    };
  }, [pathname, isAdmin]);

  return null;
}
