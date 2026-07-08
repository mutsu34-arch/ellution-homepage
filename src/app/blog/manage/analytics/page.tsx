import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import {
  formatDurationSec,
  getAnalyticsSummary,
  maskVisitorId,
} from "@/lib/analytics-store";
import { mediumLabel } from "@/lib/analytics-referrer";
import { getResolvedPublishedList } from "@/lib/posts-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "방문 통계 | 엘루션",
  robots: { index: false, follow: false },
};

type AnalyticsPageProps = {
  searchParams: { days?: string };
};

function parseDays(raw?: string): number {
  const n = Number(raw);
  if (n === 30) return 30;
  return 7;
}

function formatKstDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AnalyticsManagePage({ searchParams }: AnalyticsPageProps) {
  const session = await getServerSession(authOptions);

  if (!isAdminEmail(session?.user?.email)) {
    redirect("/login?callbackUrl=/blog/manage/analytics");
  }

  const periodDays = parseDays(searchParams.days);
  const [stats, publishedList] = await Promise.all([
    getAnalyticsSummary(periodDays),
    getResolvedPublishedList(),
  ]);
  const maxDailyViews = Math.max(...stats.daily.map((d) => d.pageViews), 1);

  const articleStatBySlug = new Map(stats.allArticles.map((a) => [a.slug, a]));
  const perPostStats = publishedList
    .map((post) => {
      const stat = articleStatBySlug.get(post.slug);
      return {
        slug: post.slug,
        title: post.title,
        date: post.date,
        views: stat?.views ?? 0,
        uniqueVisitors: stat?.uniqueVisitors ?? 0,
        avgDurationSec: stat?.avgDurationSec ?? 0,
      };
    })
    .sort((a, b) => {
      if (b.views !== a.views) return b.views - a.views;
      return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });
  const totalArticleViews = perPostStats.reduce((sum, p) => sum + p.views, 0);

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <p className="mb-2 text-sm font-semibold text-[#1e40af]">Admin</p>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-zinc-900">방문 통계</h1>
            <Link href="/blog/manage" className="text-sm font-medium text-[#1e40af] hover:underline">
              ← 칼럼 관리
            </Link>
          </div>
          <p className="max-w-3xl leading-relaxed text-zinc-600">
            홈페이지·칼럼 방문 수, 유입 경로(구글·네이버 등), 검색어, 체류 시간을 확인합니다. 관리자·편집
            페이지는 집계에서 제외됩니다.
          </p>
        </header>

        {!stats.configured && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-900">
            Firestore(FIREBASE_*)가 설정되지 않아 통계를 불러올 수 없습니다. Vercel 환경 변수를
            확인해 주세요.
          </div>
        )}

        <div className="mb-8 flex gap-2">
          {[7, 30].map((days) => (
            <Link
              key={days}
              href={`/blog/manage/analytics?days=${days}`}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                periodDays === days
                  ? "bg-[#1e40af] text-white"
                  : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              최근 {days}일
            </Link>
          ))}
        </div>

        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="방문자 수" value={stats.uniqueVisitors.toLocaleString("ko-KR")} hint="고유 방문자" />
          <StatCard label="페이지뷰" value={stats.pageViews.toLocaleString("ko-KR")} hint="전체 조회" />
          <StatCard
            label="평균 체류"
            value={formatDurationSec(stats.avgDurationSec)}
            hint="체류 기록이 있는 페이지"
          />
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold text-zinc-900">일별 추이</h2>
          {stats.daily.length === 0 ? (
            <p className="text-sm text-zinc-500">아직 수집된 데이터가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {stats.daily.map((day) => (
                <div key={day.date} className="grid grid-cols-[88px_1fr_auto] items-center gap-3">
                  <span className="text-xs font-medium text-zinc-500">{day.date}</span>
                  <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-[#1e40af]"
                      style={{ width: `${Math.max(4, (day.pageViews / maxDailyViews) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-600">
                    {day.pageViews}pv · {day.visitors}명 · {formatDurationSec(day.avgDurationSec)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-1 text-xl font-semibold text-zinc-900">유입 경로</h2>
            <p className="mb-5 text-xs text-zinc-500">세션 첫 방문 기준 · Google·Naver·직접 입력 등</p>
            {stats.topSources.length === 0 ? (
              <p className="text-sm text-zinc-500">유입 데이터가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500">
                      <th className="pb-2 pr-3 font-medium">경로</th>
                      <th className="pb-2 pr-3 font-medium">유형</th>
                      <th className="pb-2 pr-3 font-medium">유입</th>
                      <th className="pb-2 font-medium">방문자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topSources.map((source) => (
                      <tr key={source.sourceKey} className="border-b border-zinc-100 last:border-0">
                        <td className="py-3 pr-3 font-medium text-zinc-900">{source.sourceLabel}</td>
                        <td className="py-3 pr-3 text-zinc-600">{mediumLabel(source.medium)}</td>
                        <td className="py-3 pr-3 text-zinc-700">{source.entries}</td>
                        <td className="py-3 text-zinc-700">{source.uniqueVisitors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-1 text-xl font-semibold text-zinc-900">검색어 / UTM</h2>
            <p className="mb-5 text-xs text-zinc-500">
              검색엔진·utm_term에서 수집 · Google은 대부분 검색어 미제공
            </p>
            {stats.topKeywords.length === 0 ? (
              <p className="text-sm text-zinc-500">검색어 데이터가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500">
                      <th className="pb-2 pr-3 font-medium">검색어</th>
                      <th className="pb-2 pr-3 font-medium">출처</th>
                      <th className="pb-2 font-medium">유입</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topKeywords.map((item) => (
                      <tr key={`${item.sourceLabel}-${item.keyword}`} className="border-b border-zinc-100 last:border-0">
                        <td className="py-3 pr-3 font-medium text-zinc-900">{item.keyword}</td>
                        <td className="py-3 pr-3 text-zinc-600">{item.sourceLabel}</td>
                        <td className="py-3 text-zinc-700">{item.entries}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-xl font-semibold text-zinc-900">인기 칼럼</h2>
            {stats.topArticles.length === 0 ? (
              <p className="text-sm text-zinc-500">칼럼 조회 데이터가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500">
                      <th className="pb-2 pr-3 font-medium">제목</th>
                      <th className="pb-2 pr-3 font-medium">조회</th>
                      <th className="pb-2 pr-3 font-medium">방문자</th>
                      <th className="pb-2 font-medium">평균 체류</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topArticles.map((article) => (
                      <tr key={article.slug} className="border-b border-zinc-100 last:border-0">
                        <td className="py-3 pr-3">
                          <Link
                            href={`/blog/${article.slug}`}
                            className="font-medium text-[#1e40af] hover:underline line-clamp-2"
                          >
                            {article.title}
                          </Link>
                        </td>
                        <td className="py-3 pr-3 text-zinc-700">{article.views}</td>
                        <td className="py-3 pr-3 text-zinc-700">{article.uniqueVisitors}</td>
                        <td className="py-3 text-zinc-700">{formatDurationSec(article.avgDurationSec)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="mb-5 text-xl font-semibold text-zinc-900">인기 페이지</h2>
            {stats.topPages.length === 0 ? (
              <p className="text-sm text-zinc-500">페이지 조회 데이터가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500">
                      <th className="pb-2 pr-3 font-medium">경로</th>
                      <th className="pb-2 pr-3 font-medium">조회</th>
                      <th className="pb-2 font-medium">평균 체류</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topPages.map((page) => (
                      <tr key={page.path} className="border-b border-zinc-100 last:border-0">
                        <td className="py-3 pr-3">
                          <Link href={page.path} className="font-medium text-[#1e40af] hover:underline">
                            {page.path}
                          </Link>
                          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{page.title}</p>
                        </td>
                        <td className="py-3 pr-3 text-zinc-700">{page.views}</td>
                        <td className="py-3 text-zinc-700">{formatDurationSec(page.avgDurationSec)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <section className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold text-zinc-900">포스팅별 조회 수</h2>
            <span className="text-xs text-zinc-500">
              최근 {periodDays}일 · 전체 {perPostStats.length}편 · 합계 {totalArticleViews.toLocaleString("ko-KR")}회
            </span>
          </div>
          <p className="mb-5 text-xs text-zinc-500">
            공개된 모든 칼럼의 조회 수(클릭)입니다. 조회가 없는 글은 0으로 표시됩니다.
          </p>
          {perPostStats.length === 0 ? (
            <p className="text-sm text-zinc-500">공개된 칼럼이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500">
                    <th className="pb-2 pr-3 font-medium">#</th>
                    <th className="pb-2 pr-3 font-medium">제목</th>
                    <th className="pb-2 pr-3 font-medium">조회</th>
                    <th className="pb-2 pr-3 font-medium">방문자</th>
                    <th className="pb-2 font-medium">평균 체류</th>
                  </tr>
                </thead>
                <tbody>
                  {perPostStats.map((post, index) => (
                    <tr key={post.slug} className="border-b border-zinc-100 last:border-0">
                      <td className="py-3 pr-3 text-zinc-400">{index + 1}</td>
                      <td className="py-3 pr-3">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-medium text-[#1e40af] hover:underline line-clamp-2"
                        >
                          {post.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-zinc-500">{post.date}</p>
                      </td>
                      <td className="py-3 pr-3 font-semibold text-zinc-900">{post.views}</td>
                      <td className="py-3 pr-3 text-zinc-700">{post.uniqueVisitors}</td>
                      <td className="py-3 text-zinc-700">{formatDurationSec(post.avgDurationSec)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold text-zinc-900">최근 조회</h2>
          {stats.recentViews.length === 0 ? (
            <p className="text-sm text-zinc-500">최근 조회 기록이 없습니다.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500">
                    <th className="pb-2 pr-3 font-medium">시각</th>
                    <th className="pb-2 pr-3 font-medium">페이지</th>
                    <th className="pb-2 pr-3 font-medium">유입</th>
                    <th className="pb-2 pr-3 font-medium">방문자</th>
                    <th className="pb-2 font-medium">체류</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentViews.map((view, index) => (
                    <tr key={`${view.startedAt}-${view.path}-${index}`} className="border-b border-zinc-100 last:border-0">
                      <td className="py-3 pr-3 text-zinc-600">{formatKstDateTime(view.startedAt)}</td>
                      <td className="py-3 pr-3">
                        <Link href={view.path} className="text-[#1e40af] hover:underline">
                          {view.path}
                        </Link>
                        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{view.title}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="text-zinc-800">{view.sourceLabel ?? "-"}</p>
                        {view.searchKeyword && (
                          <p className="mt-0.5 text-xs text-zinc-500">「{view.searchKeyword}」</p>
                        )}
                      </td>
                      <td className="py-3 pr-3 font-mono text-xs text-zinc-600">
                        {maskVisitorId(view.visitorId)}
                      </td>
                      <td className="py-3 text-zinc-700">
                        {view.durationSec != null ? formatDurationSec(view.durationSec) : "측정 중"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-900">{value}</p>
      <p className="mt-1 text-xs text-zinc-400">{hint}</p>
    </article>
  );
}
