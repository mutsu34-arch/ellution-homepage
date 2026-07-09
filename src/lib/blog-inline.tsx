import type { ReactNode } from "react";
import { createElement, Fragment } from "react";
import { replaceLatexInlineSymbols } from "./markdown";

export type InlineNode =
  | { type: "text"; value: string }
  | { type: "bold"; children: InlineNode[] }
  | { type: "underline"; children: InlineNode[] }
  | { type: "blue"; children: InlineNode[] }
  | { type: "red"; children: InlineNode[] };

type InlineMarkerType = Exclude<InlineNode["type"], "text">;

const MARKERS: { open: string; close: string; type: InlineMarkerType }[] = [
  { open: "{{blue}}", close: "{{/blue}}", type: "blue" },
  { open: "{{red}}", close: "{{/red}}", type: "red" },
  { open: "**", close: "**", type: "bold" },
  { open: "__", close: "__", type: "underline" },
];

function normalizeMarkdownArtifacts(line: string): string {
  if (/^\*{3}.+\*{2}/.test(line)) {
    return line.replace(/^\*{3}/, "**");
  }
  return line;
}

export function parseInlineMarkdown(text: string): InlineNode[] {
  if (!text) return [];

  let earliest: { index: number; marker: (typeof MARKERS)[number] } | null = null;

  for (const marker of MARKERS) {
    const index = text.indexOf(marker.open);
    if (index !== -1 && (earliest === null || index < earliest.index)) {
      earliest = { index, marker };
    }
  }

  if (!earliest) {
    return [{ type: "text", value: text }];
  }

  const { index, marker } = earliest;
  const nodes: InlineNode[] = [];

  if (index > 0) {
    nodes.push({ type: "text", value: text.slice(0, index) });
  }

  const afterOpen = index + marker.open.length;
  const closeIdx = text.indexOf(marker.close, afterOpen);

  if (closeIdx === -1) {
    nodes.push({ type: "text", value: text.slice(index) });
    return nodes;
  }

  const inner = text.slice(afterOpen, closeIdx);
  nodes.push({ type: marker.type, children: parseInlineMarkdown(inner) });
  nodes.push(...parseInlineMarkdown(text.slice(closeIdx + marker.close.length)));

  return nodes;
}

function renderInlineNode(node: InlineNode, key: string): ReactNode {
  if (node.type === "text") {
    return node.value;
  }

  const children = node.children.map((child, index) =>
    createElement(Fragment, { key: `${key}-${index}` }, renderInlineNode(child, `${key}-${index}`)),
  );

  switch (node.type) {
    case "bold":
      return createElement("strong", { key, className: "font-bold" }, children);
    case "underline":
      return createElement(
        "span",
        { key, className: "underline decoration-zinc-500 underline-offset-2" },
        children,
      );
    case "blue":
      return createElement("span", { key, className: "font-semibold text-[#1e40af]" }, children);
    case "red":
      return createElement("span", { key, className: "font-semibold text-[#dc2626]" }, children);
    default:
      return createElement("span", { key }, children);
  }
}

export function renderInlineMarkdown(text: string): ReactNode[] {
  const normalized = replaceLatexInlineSymbols(normalizeMarkdownArtifacts(text));
  return parseInlineMarkdown(normalized).map((node, index) => renderInlineNode(node, `inline-${index}`));
}
