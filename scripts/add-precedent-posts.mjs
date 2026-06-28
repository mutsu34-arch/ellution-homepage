import fs from "fs";

const posts = [
  {
    file: "c:/Users/mutsu/Downloads/gemini-code-1782629586447.html",
    slug: "administrative-vicarious-execution-18",
    title:
      "[행정법 판례분석 18] 무허가 증축 철거 대집행 계고처분 사건 (행정대집행의 요건)",
    date: "2026-07-16",
    excerpt:
      "대집행의 4대 요건(공·대·보·심), 단순 의무불이행만으로는 불가한 '심히 공익을 해할 것' 요건, 대집행의 재량행위성 등 행정대집행 법리를 분석합니다.",
  },
  {
    file: "c:/Users/mutsu/Downloads/gemini-code-1782629601777.html",
    slug: "enforcement-fine-nature-19",
    title:
      "[행정법 판례분석 19] 시정명령 이행과 이행강제금 부과 사건 (이행강제금의 본질)",
    date: "2026-07-17",
    excerpt:
      "이행강제금의 간접강제 본질, 부과 전 이행 시 기한 도과 불문 부과 불가, 부과 후 이행 시 기징수, 이중처벌금지원칙 등 이행강제금 법리를 정리합니다.",
  },
  {
    file: "c:/Users/mutsu/Downloads/gemini-code-1782629651996.html",
    slug: "administrative-fine-objection-20",
    title:
      "[행정법 판례분석 20] 질서위반행위규제법상 과태료 부과와 이의제기 사건 (과태료의 핵심 쟁점)",
    date: "2026-07-18",
    excerpt:
      "과태료의 고의·과실 요건, 위법성 착오, 60일 이의제기와 처분의 효력 상실 및 법원 과태료 재판 이행 등 질서위반행위규제법의 핵심 쟁점을 분석합니다.",
  },
];

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1].trim() : html;
}

function escapeTemplateLiteral(value) {
  return value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

const entries = posts
  .map((post) => {
    const html = extractBody(fs.readFileSync(post.file, "utf8"));
    const escaped = escapeTemplateLiteral(html);
    return `  {
    slug: "${post.slug}",
    title: "${post.title}",
    date: "${post.date}",
    excerpt:
      "${post.excerpt}",
    content: [],
    html: \`
${escaped}
    \`,
  },`;
  })
  .join("\n");

const tsPath = "src/lib/blog-precedent-series.ts";
let ts = fs.readFileSync(tsPath, "utf8");
const marker = "export const precedentSeriesPosts: BlogPost[] = [";

if (ts.includes("administrative-vicarious-execution-18")) {
  console.log("Already added");
  process.exit(0);
}

if (!ts.includes(marker)) {
  throw new Error("marker not found");
}

ts = ts.replace(marker, `${marker}\n${entries}`);
fs.writeFileSync(tsPath, ts, "utf8");
console.log("Added episodes 15, 16, 17");
