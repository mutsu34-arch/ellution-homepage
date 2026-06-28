/**
 * 관리자(글 편집 권한) 계정.
 * 이메일은 비밀이 아니므로 서버/클라이언트 양쪽에서 동일하게 사용합니다.
 * 환경변수(ADMIN_EMAIL)로 덮어쓸 수 있습니다.
 */
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "mutsu34@gmail.com";

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
}
