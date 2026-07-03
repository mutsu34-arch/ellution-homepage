/** 사이트맵·RSS·robots 등에 쓰는 공식 도메인 (NEXTAUTH_URL 우선) */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "");
  return fromEnv || "https://ellution.co.kr";
}
