/**
 * 요청 host에서 서브도메인 부분 추출
 * 예: app-a.example.com -> app-a, example.com -> null
 */
export function getSubdomain(host: string, rootDomain?: string): string | null {
  if (!host) return null;
  const parts = host.split(".");
  if (parts.length <= 2) return null; // example.com
  // rootDomain이 있으면 정확히 매칭해서 서브도메인만 반환
  if (rootDomain && host.endsWith(rootDomain) && host !== rootDomain) {
    return host.slice(0, -(rootDomain.length + 1));
  }
  return parts[0];
}

/** 메인 포털 도메인인지 (서브도메인이 없거나 www) */
export function isPortalHost(host: string, rootDomain?: string): boolean {
  const sub = getSubdomain(host, rootDomain);
  return sub === null || sub === "www";
}
