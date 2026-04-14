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
