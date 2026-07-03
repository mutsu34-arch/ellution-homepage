/**
 * 리치 HTML 본문을 "일반 글(마크다운식)" 텍스트로 변환합니다.
 * - 제목 태그(h1~h3) → ## / ###
 * - 목록 항목(li) → "- "
 * - 그 외 블록 → 문단
 * 색깔 박스 등 시각적 장식은 사라지지만, 편집하기 쉬운 일반 텍스트가 됩니다.
 */
export function htmlToMarkdown(html: string): string {
  let s = html;

  // 주석 / script / style 제거
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");

  // 줄바꿈 처리
  s = s.replace(/<br\s*\/?>/gi, "\n");

  // 제목
  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n\n## $1\n\n");
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n");
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n");
  s = s.replace(/<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/gi, "\n\n### $1\n\n");

  // 목록 항목
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1\n");

  // 강조 → 텍스트만 유지(마크다운 기호 없이)
  s = s.replace(/<\/(strong|b|em|i|span|a)>/gi, "");
  s = s.replace(/<(strong|b|em|i|span|a)[^>]*>/gi, "");

  // 블록 종료 → 문단 분리
  s = s.replace(
    /<\/(p|div|section|article|blockquote|ul|ol|table|tr|figure|figcaption)>/gi,
    "\n\n",
  );

  // 나머지 태그 제거
  s = s.replace(/<[^>]+>/g, "");

  // HTML 엔티티 디코드(자주 쓰이는 것 위주)
  s = s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&middot;/g, "·")
    .replace(/&rarr;/g, "→")
    .replace(/&hellip;/g, "…");

  // 줄 단위 정리
  const lines = s
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim());

  // 빈 줄은 최대 1개만 유지(문단 구분)
  const out: string[] = [];
  for (const line of lines) {
    if (line === "") {
      if (out.length > 0 && out[out.length - 1] !== "") out.push("");
    } else {
      out.push(line);
    }
  }
  while (out.length && out[out.length - 1] === "") out.pop();
  while (out.length && out[0] === "") out.shift();

  return out.join("\n");
}

/** content[] 배열을 편집용 마크다운 문자열로 변환합니다. (문단은 빈 줄로 구분) */
export function contentLinesToMarkdown(lines: string[]): string {
  return lines.join("\n\n");
}

/** 편집용 마크다운 문자열을 렌더링용 라인 배열로 변환합니다. (빈 줄 제거) */
export function markdownToContentLines(body: string): string[] {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** LaTeX 인라인 기호($\rightarrow$ 등)를 읽기 쉬운 유니코드로 치환합니다. */
export function replaceLatexInlineSymbols(text: string): string {
  return text
    .replace(/\$\s*\\rightarrow\s*\$/g, "→")
    .replace(/\$\s*\\leftarrow\s*\$/g, "←")
    .replace(/\$\s*\\leftrightarrow\s*\$/g, "↔")
    .replace(/\$\s*\\Rightarrow\s*\$/g, "⇒")
    .replace(/\$\s*\\Leftarrow\s*\$/g, "⇐")
    .replace(/\$\s*\\Leftrightarrow\s*\$/g, "⇔");
}
