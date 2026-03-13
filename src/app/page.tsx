import Link from "next/link";

function StudyCardIcon() {
  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#dbeafe] flex items-center justify-center flex-shrink-0">
      <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#1e40af]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
  );
}

function SoftCardIcon() {
  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#d1fae5] flex items-center justify-center flex-shrink-0">
      <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#047857]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    </div>
  );
}

export default function HomePage() {
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
              엘루션
            </span>
            <span className="text-[10px] font-medium text-zinc-400 tracking-widest uppercase hidden sm:inline">
              Education & Legal
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="#service-intro"
              className="px-3 py-1.5 rounded-lg bg-[#dbeafe] text-[#1e40af] text-sm font-medium hover:bg-[#bfdbfe] transition-colors"
            >
              서비스 소개
            </Link>
            <Link
              href="#subscription-guide"
              className="px-3 py-1.5 rounded-lg bg-[#d1fae5] text-[#047857] text-sm font-medium hover:bg-[#a7f3d0] transition-colors"
            >
              구독 안내
            </Link>
            <Link
              href="#customer-support"
              className="px-3 py-1.5 rounded-lg bg-[#fef3c7] text-[#b45309] text-sm font-medium hover:bg-[#fde68a] transition-colors"
            >
              고객지원
            </Link>
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
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center max-w-4xl leading-tight mb-5">
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
            엘루션
          </span>
        </h1>
        <p className="text-zinc-600 text-center max-w-2xl mb-14 text-lg leading-relaxed">
          공무원 시험부터 복잡한 법률 실무까지, 실무자의 시각으로 만든 가장 정확한 웹앱을 경험하세요.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl mb-14">
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
          <article
            className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col transition-all hover:shadow-xl"
            style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}
          >
            <div className="mb-5">
              <SoftCardIcon />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-3">
              엘루션 소프트
            </h2>
            <p className="text-zinc-600 leading-relaxed mb-6 flex-1">
              사실관계 정리 앱, 변제충당 계산기 등 법률 실무 효율화 도구
            </p>
            <Link
              href="/soft"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#047857] text-white font-semibold hover:bg-[#065f46] transition-colors shadow-md hover:shadow-lg"
            >
              실무 도구 보기
            </Link>
          </article>
        </div>
        <div className="flex gap-4">
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

        {/* 서비스 소개 - Why Elution? */}
        <section
          id="service-intro"
          className="w-full max-w-6xl mx-auto mt-24 sm:mt-32 px-4 scroll-mt-20"
        >
          <div className="rounded-3xl p-8 sm:p-12 bg-[#eff6ff] border border-[#bfdbfe]/50">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1e40af] text-center mb-12">
              Why Elution?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <article className="bg-white rounded-2xl p-6 sm:p-8 text-zinc-700 leading-relaxed shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-zinc-900 text-lg mb-3">
                  변호사 직접 개발
                </h3>
                <p>
                  현직 변호사가 실무와 학습의 페인 포인트를 분석하여 직접 코딩하고 설계했습니다.
                </p>
              </article>
              <article className="bg-white rounded-2xl p-6 sm:p-8 text-zinc-700 leading-relaxed shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-zinc-900 text-lg mb-3">
                  정확한 데이터
                </h3>
                <p>
                  법률 계산기, 사실관계 정리 등 0.1%의 오차도 허용하지 않는 법률 로직을 담았습니다.
                </p>
              </article>
              <article className="bg-white rounded-2xl p-6 sm:p-8 text-zinc-700 leading-relaxed shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-zinc-900 text-lg mb-3">
                  맞춤형 패키지
                </h3>
                <p>
                  수험생을 위한 교육 앱과 전문가를 위한 업무 보조 앱을 필요한 만큼 구독하여 사용하세요.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 구독 안내 */}
        <section
          id="subscription-guide"
          className="w-full max-w-6xl mx-auto mt-12 sm:mt-16 px-4 scroll-mt-20"
        >
          <div className="rounded-3xl p-8 sm:p-12 bg-[#ecfdf5] border border-[#a7f3d0]/50">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#047857] text-center mb-8">
              구독 안내
            </h2>
            <p className="text-zinc-700 text-center max-w-2xl mx-auto leading-relaxed">
              엘루션 스터디와 엘루션 소프트는 개별 앱 단위로 구독하거나, 패키지로 함께 이용하실 수 있습니다. 로그인 후 대시보드에서 원하는 서비스를 선택해 주세요.
            </p>
          </div>
        </section>

        {/* 고객지원 */}
        <section
          id="customer-support"
          className="w-full max-w-6xl mx-auto mt-12 sm:mt-16 px-4 scroll-mt-20"
        >
          <div className="rounded-3xl p-8 sm:p-12 bg-[#fffbeb] border border-[#fde68a]/60">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#b45309] text-center mb-8">
              고객지원
            </h2>
            <p className="text-zinc-700 text-center max-w-2xl mx-auto leading-relaxed">
              서비스 이용 문의나 기술 지원이 필요하시면 하단 연락처로 연락해 주세요.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 bg-white mt-24">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
          <div className="text-zinc-600 text-sm space-y-2 mb-6">
            <p className="font-semibold text-zinc-800">엘루션</p>
            <p>서울특별시 강남구 테헤란로 123 엘루션빌딩 5층</p>
            <p>대표전화: 02-1234-5678</p>
            <p>이메일: contact@ellution.co.kr</p>
          </div>
          <p className="text-zinc-500 text-sm">
            Copyright © 2024 Elution. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
