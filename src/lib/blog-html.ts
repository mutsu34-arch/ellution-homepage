/**
 * 리치 HTML 본문의 불릿 목록을 파란색 볼드 문단으로 변환합니다.
 * (Tailwind CDN preflight·인라인 스타일과 무관하게 동작)
 */
import { replaceLatexInlineSymbols } from "./markdown";
function convertListBlock(innerHtml: string): string {
  const items = innerHtml.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, text) => {
    return `<p class="blog-emphasis-line">${text.trim()}</p>`;
  });
  return `<div class="blog-emphasis-lines">${items}</div>`;
}

export function normalizeBlogHtml(html: string): string {
  let result = html;

  // class가 있는 목록부터 (중첩 순서 유지)
  result = result.replace(
    /<ul\s+class="nested-list"[^>]*>([\s\S]*?)<\/ul>/gi,
    (_m, inner) => convertListBlock(inner),
  );
  result = result.replace(
    /<ul\s+class="summary-list"[^>]*>([\s\S]*?)<\/ul>/gi,
    (_m, inner) => convertListBlock(inner),
  );

  // info-list가 아닌 일반 ul (인라인 style 포함)
  result = result.replace(
    /<ul(?![^>]*class="info-list")[^>]*>([\s\S]*?)<\/ul>/gi,
    (_m, inner) => convertListBlock(inner),
  );

  // ol 목록도 동일 처리
  result = result.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_m, inner) => convertListBlock(inner));

  return replaceLatexInlineSymbols(result);
}
