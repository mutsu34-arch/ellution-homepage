import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { getKstTodayString } from "@/lib/blog";
import { getResolvedPublishedList, getResolvedScheduledList } from "@/lib/posts-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "칼럼 관리 | 엘루션",
  robots: { index: false, follow: false },
};

function formatKoreanDate(date: string): string {
  return new Date(`${date}T12:00:00+09:00`).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function daysUntil(date: string, today: string): number {
  const start = new Date(`${today}T00:00:00+09:00`).getTime();
  const target = new Date(`${date}T00:00:00+09:00`).getTime();
  return Math.round((target - start) / (24 * 60 * 60 * 1000));
}

export default async function BlogManagePage() {
  const session = await getServerSession(authOptions);

  if (!isAdminEmail(session?.user?.email)) {
    redirect("/login?callbackUrl=/blog/manage");
  }

  const today = getKstTodayString();
  const [scheduledPosts, publishedPosts] = await Promise.all([
    getResolvedScheduledList(),
    getResolvedPublishedList(),
  ]);

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="mb-2 text-sm font-semibold text-[#1e40af]">Admin</p>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-zinc-900">칼럼 관리</h1>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog/manage/analytics"
                className="inline-flex rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                방문 통계
              </Link>
              <Link
                href="/blog/manage/new"
                className="inline-flex rounded-lg bg-[#1e40af] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1e3a8a]"
              >
                + 새 글 작성
              </Link>
            </div>
          </div>
          <p className="max-w-3xl leading-relaxed text-zinc-600">
            예약 발행 대기 중인 글을 확인하고 편집할 수 있습니다. 공개일(KST)이 도래하면 자동으로 칼럼
            목록에 노출됩니다.
          </p>
          <p className="mt-2 text-sm text-zinc-500">오늘(KST): {formatKoreanDate(today)}</p>
        </header>

        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">예약 발행</h2>
              <p className="mt-1 text-sm text-zinc-500">총 {scheduledPosts.length}편</p>
            </div>
            <Link href="/blog" className="text-sm font-medium text-[#1e40af] hover:underline">
              공개 칼럼 보기 →
            </Link>
          </div>

          {scheduledPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center text-zinc-500">
              예약 발행 대기 중인 글이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {scheduledPosts.map((post) => {
                const remaining = daysUntil(post.date, today);
                return (
                  <article
                    key={post.slug}
                    className="rounded-2xl border border-amber-200 bg-white p-6 sm:p-7"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                        D-{remaining}
                      </span>
                      <span className="text-sm font-medium text-zinc-700">
                        {formatKoreanDate(post.date)} 공개 예정
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-semibold leading-snug text-zinc-900">{post.title}</h3>
                    <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-zinc-600">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/blog/${post.slug}/edit`}
                        className="inline-flex rounded-lg bg-[#1e40af] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e3a8a]"
                      >
                        편집하기
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                      >
                        미리보기
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-zinc-900">공개 중</h2>
            <p className="mt-1 text-sm text-zinc-500">최근 공개된 글 {publishedPosts.length}편</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {publishedPosts.slice(0, 10).map((post) => (
              <article
                key={post.slug}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="mb-1 text-xs text-zinc-500">{formatKoreanDate(post.date)}</p>
                  <h3 className="truncate text-base font-semibold text-zinc-900">{post.title}</h3>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    보기
                  </Link>
                  <Link
                    href={`/blog/${post.slug}/edit`}
                    className="inline-flex rounded-lg border border-[#1e40af] bg-blue-50 px-3.5 py-2 text-sm font-semibold text-[#1e40af] hover:bg-blue-100"
                  >
                    편집
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
