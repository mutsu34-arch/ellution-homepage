import Link from "next/link";
import { blogPosts } from "@/lib/blog";

function StudyCardIcon() {
  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#dbeafe] flex items-center justify-center flex-shrink-0">
      <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#1e40af]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* 은은한 그라데이션 오버레이 */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(249,250,251,0.95) 0%, rgba(243,244,246,0.98) 50%, rgba(249,250,251,1) 100%)",
        }}
        aria-hidden
      />
      <header className="relative z-10 border-b border-zinc-200/80 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-3">
          <Link
            href="/"
            className="flex items-baseline gap-1.5 group"
          >
            <span
              className="text-2xl font-bold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1e3a8a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.03em",
              }}
            >
              엘루션 스터디
            </span>
            <span className="text-[10px] font-medium text-zinc-400 tracking-widest uppercase hidden sm:inline">
              Legal Education
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-3">
            <Link href="/login" className="text-zinc-600 hover:text-zinc-900 transition-colors">
              로그인
            </Link>
            <Link
              href="/register"
              className="bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors"
            >
              회원가입
            </Link>
          </nav>
        </div>
      </header>
      <main className="relative z-10 flex-1 px-4 py-20">
        <section className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold max-w-4xl mx-auto leading-tight mb-5">
            <span className="block text-zinc-600">현직 변호사가 직접 설계한</span>
            <span className="block text-[#1e40af] mt-1">교육 & 법률 스마트 솔루션</span>
            <span
              className="block mt-2 text-4xl sm:text-5xl lg:text-6xl"
              style={{
                background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              엘루션 스터디
            </span>
          </h1>
          <p className="text-zinc-600 max-w-3xl mx-auto mb-14 text-lg leading-relaxed">
            변호사시험, 공무원 시험 등 법학 과목 중심의 기출 학습 서비스와 전문 칼럼 콘텐츠를 제공합니다.
          </p>
        </section>

        <section className="max-w-4xl mx-auto mb-14">
          <article
            className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col transition-all hover:shadow-xl"
            style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <div className="mb-5">
              <StudyCardIcon />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-3">
              엘루션 스터디
            </h2>
            <p className="text-zinc-600 leading-relaxed mb-6 flex-1">
              공무원 법과목, 영어, 한국사 등 핵심 암기 및 문제풀이 솔루션
            </p>
            <Link
              href="/study"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1e40af] text-white font-semibold hover:bg-[#1e3a8a] transition-colors shadow-md hover:shadow-lg"
            >
              학습 시작하기
            </Link>
          </article>
        </section>

        <section className="max-w-6xl mx-auto mb-16 rounded-2xl border border-zinc-200 bg-white p-7 sm:p-10">
          <p className="text-sm font-semibold text-[#1e40af] mb-2">Our Services</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-4">
            행정법 Q: 변호사가 설계한 AI 기반 행정법 CBT 학습 플랫폼
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-6 max-w-3xl">
            실전형 CBT 훈련, 오답 패턴 분석, 개인 맞춤형 복습 흐름을 통해 수험생이 합격권 점수에 도달할 수 있도록
            설계했습니다.
          </p>
          <Link
            href="https://adminlawq.ellution.co.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-xl bg-[#1e40af] px-6 py-3 text-white font-semibold hover:bg-[#1e3a8a] transition-colors"
          >
            행정법 Q 바로가기
          </Link>
        </section>

        <section className="max-w-6xl mx-auto mb-14">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm font-semibold text-[#1e40af]">Latest Insights</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">전문가 칼럼</h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              전체 글 보기
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {latestPosts.map((post) => (
              <article key={post.slug} className="rounded-2xl border border-zinc-200 bg-white p-6">
                <p className="text-sm text-zinc-500 mb-2">
                  {new Date(post.date).toLocaleDateString("ko-KR")}
                </p>
                <h3 className="text-lg font-semibold text-zinc-900 mb-3 leading-snug">{post.title}</h3>
                <p className="text-zinc-700 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="text-[#1e40af] font-semibold hover:underline text-sm">
                  자세히 보기
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-2">
          <div className="rounded-2xl p-5 sm:p-6 bg-rose-50 border border-rose-200">
            <p className="text-rose-800 text-sm sm:text-base leading-relaxed">
              본 서비스는 교육용 플랫폼으로, 개별 사건의 권리·의무 판단, 승소 가능성 예측 등 법률 상담 및 자문 기능을
              제공하지 않습니다. 구체적인 상담은 법률 전문가를 통해 진행하시기 바랍니다.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto mt-10 flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-zinc-300 bg-white/80 text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
          >
            대시보드
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 bg-white mt-24">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="text-zinc-600 text-sm space-y-2">
              <p className="font-semibold text-zinc-800">엘루션</p>
              <p>연락처: ellutionsoft@gmail.com</p>
            </div>
            <nav className="flex gap-4 text-sm">
              <Link href="/privacy" className="text-zinc-600 hover:text-zinc-900">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-zinc-600 hover:text-zinc-900">
                이용약관
              </Link>
              <Link href="/contact" className="text-zinc-600 hover:text-zinc-900">
                문의하기
              </Link>
              <Link href="/adsense-checklist" className="text-zinc-600 hover:text-zinc-900">
                애드센스 체크리스트
              </Link>
            </nav>
          </div>
          <p className="text-zinc-500 text-sm mt-6">
            Copyright © 2024 Elution. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
