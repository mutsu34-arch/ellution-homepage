import "server-only";
import { getDb } from "./firebase-admin";
import {
  blogPosts,
  getPostBySlug,
  isPublished,
  type BlogPost,
} from "./blog";
import {
  contentLinesToMarkdown,
  htmlToMarkdown,
  markdownToContentLines,
} from "./markdown";

const COLLECTION = "posts";

/** Firestore에 저장되는 편집본(override) */
export type PostOverride = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  tags: string[];
  /** 일반 글(마크다운식) 본문 */
  body: string;
  updatedAt?: string;
};

/** 화면 렌더링에 사용하는 최종 글 형태 */
export type ResolvedPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  /** 마크다운식 본문 라인(편집본일 때 사용) */
  contentLines: string[];
  /** 블록 파싱용 원문 본문(표 등 구조 보존) */
  body: string;
  /** 원본 리치 HTML(아직 편집되지 않은 글) */
  html?: string;
  edited: boolean;
};

export async function fetchOverride(slug: string): Promise<PostOverride | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const snap = await db.collection(COLLECTION).doc(slug).get();
    if (!snap.exists) return null;
    return snap.data() as PostOverride;
  } catch (e) {
    console.error("[posts-store] fetchOverride error:", e);
    return null;
  }
}

export async function fetchAllOverrides(): Promise<Record<string, PostOverride>> {
  const db = getDb();
  if (!db) return {};
  try {
    const snap = await db.collection(COLLECTION).get();
    const map: Record<string, PostOverride> = {};
    snap.forEach((doc) => {
      map[doc.id] = doc.data() as PostOverride;
    });
    return map;
  } catch (e) {
    console.error("[posts-store] fetchAllOverrides error:", e);
    return {};
  }
}

/** slug가 코드·편집본 중 어디에든 이미 존재하는지 */
export async function isSlugTaken(slug: string): Promise<boolean> {
  if (getPostBySlug(slug)) return true;
  const override = await fetchOverride(slug);
  return override !== null;
}

export async function saveOverride(input: PostOverride): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("FIREBASE_NOT_CONFIGURED");
  const payload: PostOverride = {
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await db.collection(COLLECTION).doc(input.slug).set(payload, { merge: true });
}

function overrideToResolved(o: PostOverride): ResolvedPost {
  const body = o.body ?? "";
  return {
    slug: o.slug,
    title: o.title,
    date: o.date,
    excerpt: o.excerpt,
    tags: o.tags ?? [],
    contentLines: markdownToContentLines(body),
    body,
    html: undefined,
    edited: true,
  };
}

function baseToResolved(p: BlogPost): ResolvedPost {
  const body =
    p.content && p.content.length > 0
      ? contentLinesToMarkdown(p.content)
      : p.html
        ? htmlToMarkdown(p.html)
        : "";
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    tags: p.tags ?? [],
    contentLines: p.content ?? [],
    body,
    html: p.html,
    edited: false,
  };
}

/** slug로 최종 글을 조회합니다. (편집본이 있으면 편집본 우선) */
export async function getResolvedPost(slug: string): Promise<ResolvedPost | null> {
  const base = getPostBySlug(slug);
  const override = await fetchOverride(slug);
  if (override) {
    // 편집본은 기본 정보가 비어 있으면 원본으로 보완
    return {
      ...overrideToResolved(override),
      title: override.title || base?.title || "",
      excerpt: override.excerpt || base?.excerpt || "",
      date: override.date || base?.date || "",
      tags: override.tags?.length ? override.tags : base?.tags ?? [],
    };
  }
  if (base) return baseToResolved(base);
  return null;
}

/** 공개일이 도래한 글만 반환합니다. */
export async function getResolvedPublishedPost(
  slug: string,
): Promise<ResolvedPost | null> {
  const post = await getResolvedPost(slug);
  if (!post) return null;
  const ok = isPublished({ date: post.date } as BlogPost);
  return ok ? post : null;
}

/** 목록용 글 요약 정보 */
export type ResolvedListItem = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
};

/** 편집본을 반영한 전체 글 목록(공개·예약 포함) */
async function getResolvedAllListItems(): Promise<ResolvedListItem[]> {
  const overrides = await fetchAllOverrides();

  const merged = new Map<string, ResolvedListItem>();

  for (const post of blogPosts) {
    merged.set(post.slug, {
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      tags: post.tags ?? [],
    });
  }

  for (const [slug, o] of Object.entries(overrides)) {
    const base = merged.get(slug);
    merged.set(slug, {
      slug,
      title: o.title || base?.title || "",
      date: o.date || base?.date || "",
      excerpt: o.excerpt || base?.excerpt || "",
      tags: o.tags?.length ? o.tags : base?.tags ?? [],
    });
  }

  return Array.from(merged.values());
}

/** 편집본을 반영한 공개 글 목록(최신순). 목록/사이트맵 등에서 사용합니다. */
export async function getResolvedPublishedList(): Promise<ResolvedListItem[]> {
  return (await getResolvedAllListItems())
    .filter((item) => isPublished({ date: item.date } as BlogPost))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** 태그 유사도 우선, 부족하면 최신 글로 채워 관련 글을 고릅니다. */
export function pickRelatedPublishedPosts(
  current: { slug: string; tags?: string[] },
  candidates: ResolvedListItem[],
  max = 5,
): ResolvedListItem[] {
  const currentTags = new Set(current.tags ?? []);
  const others = candidates.filter((item) => item.slug !== current.slug);

  const ranked = others
    .map((item) => ({
      item,
      overlap: (item.tags ?? []).filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return a.item.date < b.item.date ? 1 : a.item.date > b.item.date ? -1 : 0;
    });

  const related: ResolvedListItem[] = [];
  const seen = new Set<string>();

  for (const { item, overlap } of ranked) {
    if (related.length >= max) break;
    if (overlap > 0) {
      related.push(item);
      seen.add(item.slug);
    }
  }

  for (const { item } of ranked) {
    if (related.length >= max) break;
    if (!seen.has(item.slug)) {
      related.push(item);
      seen.add(item.slug);
    }
  }

  return related.slice(0, max);
}

/** 편집본을 반영한 예약 발행 글 목록(공개일 임박순) */
export async function getResolvedScheduledList(): Promise<ResolvedListItem[]> {
  return (await getResolvedAllListItems())
    .filter((item) => !isPublished({ date: item.date } as BlogPost))
    .sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
}

/** 편집 폼 초기값(일반 글 형태). 편집본이 있으면 그 본문을, 없으면 원본을 변환합니다. */
export async function getEditableDraft(slug: string): Promise<PostOverride | null> {
  const override = await fetchOverride(slug);
  if (override) {
    return {
      slug,
      title: override.title,
      date: override.date,
      excerpt: override.excerpt,
      tags: override.tags ?? [],
      body: override.body ?? "",
    };
  }

  const base = getPostBySlug(slug);
  if (!base) return null;

  const body =
    base.content && base.content.length > 0
      ? contentLinesToMarkdown(base.content)
      : base.html
        ? htmlToMarkdown(base.html)
        : "";

  return {
    slug: base.slug,
    title: base.title,
    date: base.date,
    excerpt: base.excerpt,
    tags: base.tags ?? [],
    body,
  };
}
