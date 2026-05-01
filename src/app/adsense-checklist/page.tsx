import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "애드센스 정책 점검 체크리스트 | 엘루션",
  description: "애드센스 스크립트 삽입 전/후 운영 점검 체크리스트",
};

const beforeChecklist = [
  "개인정보처리방침, 이용약관, 문의하기 페이지가 정상 노출되는지 확인",
  "최소 15개 이상의 고품질 텍스트 콘텐츠를 게시하고 중복 문서를 정리",
  "오해 소지가 있는 과장 광고, 불법/유해 콘텐츠, 저작권 침해 요소 제거",
  "모바일/데스크톱에서 본문 가독성(폰트 크기, 줄간격, 대비) 점검",
  "Search Console 등록 및 sitemap.xml 제출 완료",
];

const afterChecklist = [
  "ads.txt 파일 게시 여부 확인(애드센스 계정 안내값 반영)",
  "초기에는 자동광고 또는 본문 상/하단 1~2개로 제한해 광고 밀도 관리",
  "광고가 본문/버튼과 혼동되지 않도록 여백과 구분선 유지",
  "Core Web Vitals 및 CLS 변동 모니터링",
  "정책 위반 알림, 제한 광고 알림, 크롤링 오류를 주 1회 이상 점검",
];

export default function AdsenseChecklistPage() {
  const adsenseClientId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
  const scriptStatus = adsenseClientId ? "설정됨" : "미설정";

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-16">
      <section className="max-w-4xl mx-auto rounded-2xl border border-zinc-200 bg-white p-7 sm:p-10">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">애드센스 정책 점검 체크리스트</h1>
        <p className="text-zinc-700 leading-relaxed mb-6">
          엘루션 사이트의 애드센스 운영 리스크를 줄이기 위해, 스크립트 삽입 전/후 점검 항목을 운영 체크리스트로
          고정합니다.
        </p>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 mb-8">
          <p className="text-sm text-zinc-600">
            현재 애드센스 클라이언트 ID(`NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT`) 상태:{" "}
            <span className="font-semibold text-zinc-900">{scriptStatus}</span>
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">스크립트 삽입 전 체크</h2>
          <ul className="space-y-2 text-zinc-800">
            {beforeChecklist.map((item) => (
              <li key={item} className="leading-relaxed">
                - {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 mb-3">스크립트 삽입 후 체크</h2>
          <ul className="space-y-2 text-zinc-800">
            {afterChecklist.map((item) => (
              <li key={item} className="leading-relaxed">
                - {item}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
