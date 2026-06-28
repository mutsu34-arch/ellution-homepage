import fs from "fs";

const posts = [
  {
    file: "c:/Users/mutsu/Downloads/gemini-code-1782628765413.html",
    slug: "approval-basic-act-supplementary-act-15",
    title:
      "[행정법 판례분석 15] 인가의 기본행위와 보충행위, 그리고 쟁송방법 (기본행위 하자론)",
    date: "2026-07-13",
    excerpt:
      "인가의 보충성, 기본행위 하자 치유 불가, 기본행위 하자만 있을 때 인가처분 취소소송의 각하 등 인가 쟁송의 번지수를 정리합니다.",
  },
  {
    file: "c:/Users/mutsu/Downloads/gemini-code-1782629213384.html",
    slug: "attached-condition-independent-dispute-16",
    title:
      "[행정법 판례분석 16] 부관의 독립쟁송가능성과 독립취소가능성 사건",
    date: "2026-07-14",
    excerpt:
      "부담 부관의 진정일부취소소송 허용, 기한·조건 등 기타 부관의 독립쟁송 불가, 부진정일부취소소송 배척 등 부관 쟁송 법리를 분석합니다.",
  },
  {
    file: "c:/Users/mutsu/Downloads/gemini-code-1782629196585.html",
    slug: "unconstitutional-tax-enforcement-17",
    title:
      "[행정법 판례분석 17] 위헌결정 이후의 체납처분 당연무효 사건 (위헌법률에 근거한 처분)",
    date: "2026-07-15",
    excerpt:
      "위헌결정 이전 처분의 취소사유, 위헌결정 이후 새로운 체납처분·집행의 당연무효, 위헌결정의 기속력 등 위헌법률에 근거한 처분의 효력을 정리합니다.",
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

if (ts.includes("approval-basic-act-supplementary-act-15")) {
  console.log("Already added");
  process.exit(0);
}

if (!ts.includes(marker)) {
  throw new Error("marker not found");
}

ts = ts.replace(marker, `${marker}\n${entries}`);
fs.writeFileSync(tsPath, ts, "utf8");
console.log("Added episodes 15, 16, 17");
