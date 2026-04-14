import Link from "next/link";
import { STUDY_APP_URLS } from "@/lib/study-apps";

const SLUG_TO_NAME: Record<string, string> = {
  "admin-law": "행정법Q",
  "civil-law": "민법Q",
  "criminal-law": "형법Q",
  "korean-history": "한국사Q",
  hanja: "한자Q",
};

export default async function StudySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = SLUG_TO_NAME[slug] ?? slug;
  const appUrl = STUDY_APP_URLS[slug];

  // 임시 점검: 포털에서 행정법Q 진입을 차단하고 안내 화면만 노출
  if (slug === "admin-law") {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/study" className="text-lg font-semibold hover:opacity-80">
              ← 엘루션 스터디
            </Link>
            <span className="text-sm text-zinc-500">서비스 점검중</span>
          </div>
        </header>
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-16">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-amber-900 mb-3">행정법Q 점검 안내</h1>
            <p className="text-amber-900 leading-relaxed mb-6">
              현재 일부 기능 안정화 작업으로 인해 포털에서의 행정법Q 접속을 임시 중단했습니다.
              점검이 완료되면 다시 이용하실 수 있습니다.
            </p>
            <Link
              href="/study"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition-colors"
            >
              과목 목록으로 돌아가기
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (appUrl) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/study" className="text-lg font-semibold hover:opacity-80">
              ← 엘루션 스터디
            </Link>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">{name}</span>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              새 탭에서 열기
            </a>
          </div>
        </header>
        <div className="flex-shrink-0 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
            아래에 퀴즈가 보이지 않으면 상단 <strong>「새 탭에서 열기」</strong>를 눌러 주세요.
          </p>
        </div>
        <main className="flex-1 min-h-0 flex flex-col">
          <iframe
            src={appUrl}
            title={name}
            className="w-full flex-1 min-h-[60vh] border-0"
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold">
            엘루션
          </Link>
          <nav className="flex gap-4">
            <Link href="/study" className="text-zinc-600 dark:text-zinc-400 hover:underline">
              스터디
            </Link>
            <Link href="/" className="text-zinc-600 dark:text-zinc-400 hover:underline">
              홈
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">{name}</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          {name} 콘텐츠를 이곳에 추가하세요.
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-8">
          웹앱을 연결하려면 .env에 NEXT_PUBLIC_STUDY_{slug.toUpperCase().replace(/-/g, "_")}_URL=웹앱주소 를 설정하세요.
        </p>
        <Link
          href="/study"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← 과목 목록으로
        </Link>
      </main>
    </div>
  );
}
