export type ContentBlock = {
  type: "h2" | "h3" | "p" | "li";
  text: string;
  id?: string;
};

/** 본문 한 줄에서 목차용 제목(h2/h3)을 추출합니다. */
export function parseContentHeading(line: string): { type: "h2" | "h3"; text: string } | null {
  const trimmed = line.trim();

  if (trimmed.startsWith("### ")) {
    return { type: "h3", text: trimmed.slice(4).trim() };
  }

  if (trimmed.startsWith("## ")) {
    return { type: "h2", text: trimmed.slice(3).trim() };
  }

  // 편집본에서 자주 쓰는 "**1. 소제목**", "**[마치며: ...]**" 형식
  const fullBold = trimmed.match(/^\*\*(.+)\*\*$/);
  if (fullBold) {
    const inner = fullBold[1].trim();
    if (/^\d+\.\s/.test(inner) || inner.startsWith("[") || inner.startsWith("마치며")) {
      return { type: "h2", text: inner };
    }
  }

  return null;
}

export function buildContentBlocks(lines: string[]): ContentBlock[] {
  let headingCount = 0;

  return lines.map((line) => {
    const heading = parseContentHeading(line);
    if (heading) {
      headingCount += 1;
      return {
        type: heading.type,
        text: heading.text,
        id: `section-${headingCount}`,
      };
    }

    if (/^[-*•]\s+/.test(line)) {
      return {
        type: "li",
        text: line.replace(/^[-*•]\s+/, "").trim(),
      };
    }

    return {
      type: "p",
      text: line,
    };
  });
}
