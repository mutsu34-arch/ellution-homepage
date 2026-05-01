import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 엘루션",
  description: "엘루션 개인정보 처리방침 안내",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-16">
      <article className="max-w-4xl mx-auto rounded-2xl border border-zinc-200 bg-white p-7 sm:p-10 space-y-6">
        <h1 className="text-3xl font-bold text-zinc-900">개인정보처리방침</h1>
        <p className="text-zinc-600">시행일: 2026년 5월 1일</p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">1. 총칙</h2>
          <p className="text-zinc-700 leading-relaxed">
            엘루션(이하 "회사")은 이용자의 개인정보를 중요하게 생각하며, 관련 법령을 준수합니다. 본 방침은 회사가
            제공하는 법률·교육·부동산 정보 서비스 및 학습 서비스에서 수집되는 개인정보의 처리 기준을 안내합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">2. 수집하는 개인정보 항목</h2>
          <p className="text-zinc-700 leading-relaxed">
            회사는 회원가입, 서비스 이용, 문의 응대를 위해 이름, 이메일, 접속 로그, 기기 정보, 결제 관련 정보(필요 시)를
            수집할 수 있습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">3. 개인정보의 이용 목적</h2>
          <p className="text-zinc-700 leading-relaxed">
            수집한 정보는 회원 식별, 학습 서비스 제공, 콘텐츠 추천, 고객 문의 처리, 서비스 개선, 관련 법령 준수 목적에
            한하여 이용됩니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">4. 구글 애드센스 광고 쿠키 수집 및 이용</h2>
          <p className="text-zinc-700 leading-relaxed">
            회사는 구글 애드센스(Google AdSense)를 통해 광고를 게재할 수 있으며, 이 과정에서 Google을 포함한 제3자
            광고사업자가 쿠키를 사용하여 이용자의 방문 기록에 기반한 맞춤형 광고를 제공할 수 있습니다. 이용자는
            브라우저 설정 또는 Google 광고 설정 페이지를 통해 맞춤형 광고를 제한하거나 쿠키 저장을 거부할 수 있습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">5. 보유 및 이용기간</h2>
          <p className="text-zinc-700 leading-relaxed">
            개인정보는 수집 및 이용 목적이 달성되면 지체 없이 파기합니다. 다만 법령에 따라 일정 기간 보관이 필요한
            정보는 관련 규정에 따라 보관 후 파기합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">6. 이용자 권리</h2>
          <p className="text-zinc-700 leading-relaxed">
            이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있으며 회사는 관계 법령에 따라 이를
            처리합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-zinc-900">7. 문의처</h2>
          <p className="text-zinc-700 leading-relaxed">
            개인정보 관련 문의: ellutionsoft@gmail.com
          </p>
        </section>
      </article>
    </main>
  );
}
