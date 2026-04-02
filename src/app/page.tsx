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
              href="#business-overview"
              className="px-3 py-1.5 rounded-lg bg-[#dbeafe] text-[#1e40af] text-sm font-medium hover:bg-[#bfdbfe] transition-colors"
            >
              사업 개요
            </Link>
            <Link
              href="#core-features"
              className="px-3 py-1.5 rounded-lg bg-[#d1fae5] text-[#047857] text-sm font-medium hover:bg-[#a7f3d0] transition-colors"
            >
              주요 기능
            </Link>
            <Link
              href="#compliance"
              className="px-3 py-1.5 rounded-lg bg-[#fef3c7] text-[#b45309] text-sm font-medium hover:bg-[#fde68a] transition-colors"
            >
              준수사항
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
        <p className="text-zinc-600 text-center max-w-3xl mb-14 text-lg leading-relaxed">
          변호사시험, 공무원 시험 등 법학 과목의 공개 기출문제를 체계화하고, AI 기반 학습 보조 기능으로
          수험생의 학습 효율을 높이는 교육 플랫폼입니다.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 w-full max-w-4xl mb-14">
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

        {/* 법률 자문 배제 고지 */}
        <section className="w-full max-w-6xl mx-auto mt-2 px-4">
          <div className="rounded-2xl p-5 sm:p-6 bg-rose-50 border border-rose-200">
            <p className="text-rose-800 text-sm sm:text-base leading-relaxed">
              본 서비스는 교육용 플랫폼으로, 개별 사건의 권리·의무 판단, 승소 가능성 예측 등 법률 상담 및 자문 기능을
              제공하지 않습니다. 구체적인 상담은 법률 전문가를 통해 진행하시기 바랍니다.
            </p>
          </div>
        </section>

        {/* 사업 개요 및 추진 배경 */}
        <section
          id="business-overview"
          className="w-full max-w-6xl mx-auto mt-24 sm:mt-32 px-4 scroll-mt-20"
        >
          <div className="rounded-3xl p-8 sm:p-12 bg-[#eff6ff] border border-[#bfdbfe]/50">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1e40af] text-center mb-12">
              사업 개요 및 추진 배경
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <article className="bg-white rounded-2xl p-6 sm:p-8 text-zinc-700 leading-relaxed shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-zinc-900 text-lg mb-3">
                  사업명 및 운영 형태
                </h3>
                <p>
                  엘루션(Ellution)은 1인 운영 개인사업자로, 인공지능 기술을 활용해 법학 교육의 효율화와 대중화를
                  목표로 합니다.
                </p>
              </article>
              <article className="bg-white rounded-2xl p-6 sm:p-8 text-zinc-700 leading-relaxed shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-zinc-900 text-lg mb-3">
                  대상 콘텐츠
                </h3>
                <p>
                  변호사시험, 공무원 시험 등 국가고시 법학 과목의 공개 기출문제를 체계화한 학습 퀴즈 및 해설
                  데이터베이스를 제공합니다.
                </p>
              </article>
              <article className="bg-white rounded-2xl p-6 sm:p-8 text-zinc-700 leading-relaxed shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-zinc-900 text-lg mb-3">
                  서비스 확장 계획
                </h3>
                <p>
                  법학 중심 서비스를 기반으로 학습 알고리즘을 고도화해 영어, 한국사, 한자 등 일반 수험 과목까지
                  순차적으로 확대할 예정입니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 주요 기능 및 운영 방식 */}
        <section
          id="core-features"
          className="w-full max-w-6xl mx-auto mt-12 sm:mt-16 px-4 scroll-mt-20"
        >
          <div className="rounded-3xl p-8 sm:p-12 bg-[#ecfdf5] border border-[#a7f3d0]/50">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#047857] text-center mb-8">
              주요 기능 및 운영 방식
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-zinc-700 leading-relaxed">
              <article className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-zinc-900 mb-2">기출문제 DB 및 맞춤 학습</h3>
                <p>
                  법학 과목 기출문항을 DB화하고, 사용자 취약 구간을 분석해 오답 노트 자동 생성 및 반복 학습을 지원합니다.
                </p>
              </article>
              <article className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-zinc-900 mb-2">법령·판례 용어 해설</h3>
                <p>
                  국어사전과 법령 용어 사전 정의를 기반으로 난해한 용어를 초보 학습자도 이해하기 쉬운 형태로 제공합니다.
                </p>
              </article>
              <article className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-zinc-900 mb-2">변호사 직접 감수</h3>
                <p>
                  제공되는 학습용 해설과 데이터는 대표 변호사가 직접 법률적 정확성을 검토하여 신뢰도를 확보합니다.
                </p>
              </article>
              <article className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-zinc-900 mb-2">직접 운영</h3>
                <p>
                  변호사 본인이 AI 학습 로직을 직접 기획·운영하며, 교육 콘텐츠 품질 관리까지 일관되게 수행합니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 변호사법 준수 및 직무 독립성 */}
        <section
          id="compliance"
          className="w-full max-w-6xl mx-auto mt-12 sm:mt-16 px-4 scroll-mt-20"
        >
          <div className="rounded-3xl p-8 sm:p-12 bg-[#fffbeb] border border-[#fde68a]/60">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#b45309] text-center mb-8">
              변호사법 준수 및 직무 독립성
            </h2>
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-zinc-700 leading-relaxed shadow-sm space-y-3">
              <p>
                본 서비스는 공개된 판례·법령·기출문제를 기반으로 한 교육용 프로그램이며, 개별 사건의 사실관계를
                판단하거나 법률적 조언을 제공하지 않습니다.
              </p>
              <p>
                비변호사와의 수익 배분이나 공동 경영 형태를 지양하며, 변호사 본인이 독립적으로 기획·운영합니다.
              </p>
              <p>
                변호사 자격 표시는 교육 콘텐츠의 신뢰성 보증 목적에 한정되며, 사건 수임 유도를 위한 홍보 수단으로
                사용하지 않습니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 bg-white mt-24">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
          <div className="text-zinc-600 text-sm space-y-2 mb-6">
            <p className="font-semibold text-zinc-800">엘루션</p>
            <p>사업장 소재지: 서울특별시 서초구 서초중앙로 49, 609호(서초동, 동양라디안루키)</p>
            <p>이메일: ellutionsoft@gmail.com</p>
          </div>
          <p className="text-zinc-500 text-sm">
            Copyright © 2024 Elution. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
