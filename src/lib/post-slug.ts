const PHRASE_ENTRIES: [string, string][] = [
  ["행정법 판례분석", ""],
  ["행정법 중요 판례 분석", ""],
  ["제3자의", "third-party"],
  ["제3자", "third-party"],
  ["항고소송", "appeal"],
  ["경원관계", "relief"],
  ["경업관계", "competition"],
  ["원고적격", "standing"],
  ["신뢰보호", "legitimate-expectation"],
  ["직권취소", "ex-officio-revocation"],
  ["철회", "withdrawal"],
  ["이행강제금", "enforcement-fine"],
  ["대집행", "administrative-execution"],
  ["금반언", "estoppel"],
  ["부관", "attached-condition"],
  ["행정행위", "administrative-act"],
  ["행정처분", "administrative-disposition"],
  ["재량행위", "discretionary-act"],
  ["기속행위", "binding-act"],
  ["당사자소송", "party-action"],
  ["공법상 계약", "public-law-contract"],
  ["공법상계약", "public-law-contract"],
  ["과태료", "administrative-fine"],
  ["이의제기", "objection"],
  ["시정명령", "correction-order"],
  ["허가", "permit"],
  ["인가", "authorization"],
  ["판례분석", ""],
  ["판례", "precedent"],
  ["법리", ""],
  ["사건", ""],
  ["개념", "concept"],
  ["구별", "distinction"],
  ["차이", "difference"],
  ["원칙", "principle"],
  ["요건", "requirements"],
  ["효력", "effect"],
  ["무효", "void"],
  ["취소", "revocation"],
  ["위법", "illegality"],
  ["재량", "discretion"],
  ["심사", "review"],
  ["소송", "litigation"],
  ["행정", "administrative"],
];

const PHRASE_MAP = [...PHRASE_ENTRIES].sort((a, b) => b[0].length - a[0].length);

function extractSeriesNumber(title: string): string | null {
  const bracketMatch = title.match(/\[[^\]]*?(\d+)\]/);
  if (bracketMatch) return bracketMatch[1];

  const seriesMatch = title.match(/판례분석\s*(\d+)/);
  return seriesMatch?.[1] ?? null;
}

function extractCaseRef(title: string): string | null {
  const duMatch = title.match(/(\d{2,4})두(\d+)/);
  if (duMatch) return `${duMatch[1]}du${duMatch[2]}`;

  const nuMatch = title.match(/(\d{2})누(\d+)/);
  if (nuMatch) return `${nuMatch[1]}nu${nuMatch[2]}`;

  return null;
}

function normalizeSlug(parts: string[]): string {
  const slug = parts
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .join("-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug.slice(0, 200);
}

/** 관리자 제목 입력값으로 URL slug 초안을 생성합니다. */
export function generateSlugFromTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "";

  const seriesNumber = extractSeriesNumber(trimmed);
  const caseRef = extractCaseRef(trimmed);

  let working = trimmed
    .replace(/^\[[^\]]+\]\s*/, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[>《》:,，.·…/]/g, " ");

  const tokens: string[] = [];

  for (const [phrase, english] of PHRASE_MAP) {
    if (!phrase) continue;
    while (working.includes(phrase)) {
      if (english) tokens.push(english);
      working = working.replace(phrase, " ");
    }
  }

  const latinTokens = working.match(/[a-zA-Z0-9]+/g);
  if (latinTokens) {
    tokens.push(...latinTokens.map((token) => token.toLowerCase()));
  }

  if (seriesNumber) tokens.push(seriesNumber);
  if (caseRef) tokens.push(caseRef);

  const slug = normalizeSlug(tokens);
  return slug || "post";
}
