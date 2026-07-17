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
              <p className="text-[11px] text-zinc-500">Legal · Education · Content</p>
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
            변호사가 직접 쓰는 행정법·법률 칼럼
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-5xl">
            판례와 수험 논점을
            <span className="block bg-gradient-to-r from-[#1e40af] to-[#3b82f6] bg-clip-text text-transparent">
              쉽게 풀어 쓰는 엘루션
            </span>
          </h1>
          <p className="max-w-3xl text-zinc-600 sm:text-lg">
            행정법 판례 분석, 수험 전략, 법률·교육 인사이트를 본 사이트에서 정기적으로 발행합니다. 핵심 쟁점과
            함정을 정리해 학습에 바로 쓸 수 있도록 돕습니다.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded-xl bg-[#1e40af] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1e3a8a]"
            >
              전문가 칼럼 보기
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              회사소개
            </Link>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs text-zinc-500">콘텐츠</p>
            <p className="mt-1 text-lg font-semibold">판례 분석</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              대법원·헌법재판소 판례의 사실관계, 쟁점, 결론을 수험생 눈높이로 해설합니다.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs text-zinc-500">학습</p>
            <p className="mt-1 text-lg font-semibold">수험 전략</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              OX·사례형에서 자주 나오는 함정과 정리 공식을 칼럼으로 정리합니다.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-xs text-zinc-500">운영</p>
            <p className="mt-1 text-lg font-semibold">변호사 검수</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              모든 칼럼은 변호사의 검수를 거쳐 발행하며, 교육용 콘텐츠 기준으로 관리합니다.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#1e40af]">Latest Insights</p>
              <h2 className="text-2xl font-bold sm:text-3xl">전문가 칼럼</h2>
              <p className="mt-1 text-sm text-zinc-500">
                행정법 판례 분석·수험 전략 칼럼을 정기적으로 발행합니다.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1e40af] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3a8a]"
            >
              전체 글 보기
              <span aria-hidden="true">→</span>
            </Link>
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
