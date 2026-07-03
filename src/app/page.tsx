import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";

export const revalidate = 3600;

export default function HomePage() {
  const latestPosts = getPublishedPosts().slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute right-0 top-52 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af] text-sm font-bold text-white">
              E
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight">엘루션</p>
              <p className="text-[11px] text-zinc-500">Legal · Education · IT</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/blog" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">
              칼럼
            </Link>
            <Link href="/about" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100">
              회사소개
            </Link>
            <Link href="/login" className="rounded-lg bg-[#1e40af] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#1e3a8a]">
              로그인
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:pt-16">
        <section className="mb-10 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_10px_40px_rgba(2,6,23,0.06)] backdrop-blur sm:p-10">
          <p className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1e40af]">
            변호사가 설계한 학습·법률 콘텐츠 허브
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-5xl">
            수험생 성장을 돕는
            <span className="block bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
              엘루션 콘텐츠 플랫폼
            </span>
          </h1>
          <p className="max-w-3xl text-zinc-600 sm:text-lg">
            행정법 학습 서비스와 전문가 칼럼을 한곳에 모았습니다. 최신 기출, 판례 기반 요약, 실전형 학습 루틴으로
            합격까지의 시간을 줄여드립니다.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="https://adminlawq.ellution.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1e3a8a]"
            >
              행정법Q 바로가기
            </Link>
            <Link
              href="/blog"
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              전문가 칼럼 보기
            </Link>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="https://adminlawq.ellution.co.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <p className="text-xs text-zinc-500">학습 서비스</p>
            <p className="mt-1 text-lg font-semibold">행정법Q</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">OX 인출 훈련과 오답노트 자동화로 회독 효율을 높입니다.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#1e40af]">
              학습 앱 바로가기
              <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
          <Link
            href="/blog"
            className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <p className="text-xs text-zinc-500">전문 콘텐츠</p>
            <p className="mt-1 text-lg font-semibold">Latest Insights</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">판례 핵심과 함정을 빠르게 정리한 수험생 친화형 칼럼.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#1e40af]">
              전문가 칼럼 보기
              <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
          <Link
            href="/about"
            className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <p className="text-xs text-zinc-500">운영 원칙</p>
            <p className="mt-1 text-lg font-semibold">신뢰 기반 운영</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">정책 페이지, SEO, 광고 컴플라이언스를 체계적으로 관리합니다.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#1e40af]">
              회사소개 보기
              <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </section>

        <section className="mb-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#1e40af]">Latest Insights</p>
              <h2 className="text-2xl font-bold sm:text-3xl">전문가 칼럼</h2>
              <p className="mt-1 text-sm text-zinc-500">
                행정법 학습 칼럼은 <span className="font-medium text-zinc-700">학습 칼럼 블로그</span>에서 더 깊이 있게 만나보세요.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="https://edu.ellution.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1e40af] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3a8a]"
              >
                학습 칼럼 블로그
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/blog"
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                전체 글 보기
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {latestPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <p className="mb-2 text-xs text-zinc-500">{new Date(post.date).toLocaleDateString("ko-KR")}</p>
                <h3 className="mb-4 text-base font-semibold leading-snug sm:text-lg">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block w-full rounded-lg border-2 border-zinc-200 bg-zinc-50 px-3 py-3 text-left text-zinc-900 shadow-sm transition hover:border-[#1e40af] hover:bg-blue-50/80 hover:text-[#1e40af] active:scale-[0.99] sm:px-4 sm:py-3.5"
                  >
                    <span className="line-clamp-2">{post.title}</span>
                  </Link>
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
