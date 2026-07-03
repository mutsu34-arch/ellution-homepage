/** 공식 사이트 URL (애드센스·서치콘솔 기준 www 도메인) */
export const SITE_URL = "https://www.ellution.co.kr";

/** 사이트맵·RSS·robots·canonical 등에 쓰는 공식 도메인 */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    process.env.SITE_URL?.replace(/\/$/, "");
  return fromEnv || SITE_URL;
}
