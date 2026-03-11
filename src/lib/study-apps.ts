/**
 * 스터디 과목별 외부 웹앱 URL
 * .env에 NEXT_PUBLIC_STUDY_* 변수를 넣으면 덮어씁니다.
 * 여기 기본값이 있으면 .env 없이도 동작합니다.
 */
const DEFAULT_STUDY_APP_URLS: Record<string, string> = {
  "admin-law": "https://quiz-seven-black.vercel.app/",
};

export const STUDY_APP_URLS: Record<string, string | undefined> = {
  "admin-law": process.env.NEXT_PUBLIC_STUDY_ADMIN_LAW_URL ?? DEFAULT_STUDY_APP_URLS["admin-law"],
  "civil-law": process.env.NEXT_PUBLIC_STUDY_CIVIL_LAW_URL,
  "criminal-law": process.env.NEXT_PUBLIC_STUDY_CRIMINAL_LAW_URL,
  "korean-history": process.env.NEXT_PUBLIC_STUDY_KOREAN_HISTORY_URL,
  hanja: process.env.NEXT_PUBLIC_STUDY_HANJA_URL,
};
