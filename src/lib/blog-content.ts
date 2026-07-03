export type ContentBlock =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "li"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export type HeadingBlock = Extract<ContentBlock, { type: "h2" } | { type: "h3" }>;

function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.length > 2;
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-{2,}:?$/.test(cell));
}

function parseMarkdownTable(tableLines: string[]): { headers: string[]; rows: string[][] } | null {
  if (tableLines.length === 0) return null;

  const parsed = tableLines.map(parseTableRow);
  const headers = parsed[0];
  if (headers.length === 0) return null;

  const dataStart = parsed.length > 1 && isSeparatorRow(parsed[1]) ? 2 : 1;
  const rows = parsed.slice(dataStart).filter((row) => row.some((cell) => cell.length > 0));

  return { headers, rows };
}

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
  const blocks: ContentBlock[] = [];
  let headingCount = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isTableRow(line)) {
      const tableLines: string[] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        tableLines.push(lines[i]);
        i += 1;
      }

      const table = parseMarkdownTable(tableLines);
      if (table) {
        blocks.push({ type: "table", headers: table.headers, rows: table.rows });
        continue;
      }

      for (const tableLine of tableLines) {
        blocks.push({ type: "p", text: tableLine });
      }
      continue;
    }

    const heading = parseContentHeading(line);
    if (heading) {
      headingCount += 1;
      blocks.push({
        type: heading.type,
        text: heading.text,
        id: `section-${headingCount}`,
      });
      i += 1;
      continue;
    }

    if (/^[-*•]\s+/.test(line)) {
      blocks.push({
        type: "li",
        text: line.replace(/^[-*•]\s+/, "").trim(),
      });
      i += 1;
      continue;
    }

    blocks.push({
      type: "p",
      text: line,
    });
    i += 1;
  }

  return blocks;
}
