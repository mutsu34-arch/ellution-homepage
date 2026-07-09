export type TextareaSelection = {
  start: number;
  end: number;
  text: string;
};

export function getTextareaSelection(textarea: HTMLTextAreaElement): TextareaSelection {
  return {
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
    text: textarea.value,
  };
}

export function applyTextareaUpdate(
  textarea: HTMLTextAreaElement,
  nextValue: string,
  selectionStart: number,
  selectionEnd: number,
  onChange: (value: string) => void,
): void {
  onChange(nextValue);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(selectionStart, selectionEnd);
  });
}

export function wrapTextareaSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  onChange: (value: string) => void,
): void {
  const { start, end, text } = getTextareaSelection(textarea);
  const selected = text.slice(start, end);
  const nextValue = `${text.slice(0, start)}${before}${selected}${after}${text.slice(end)}`;
  const cursorStart = start + before.length;
  const cursorEnd = cursorStart + selected.length;
  applyTextareaUpdate(textarea, nextValue, cursorStart, cursorEnd, onChange);
}

export function stripColorMarkup(value: string): string {
  return value
    .replace(/\{\{blue\}\}/g, "")
    .replace(/\{\{\/blue\}\}/g, "")
    .replace(/\{\{red\}\}/g, "")
    .replace(/\{\{\/red\}\}/g, "");
}

export function clearColorInSelection(
  textarea: HTMLTextAreaElement,
  onChange: (value: string) => void,
): void {
  const { start, end, text } = getTextareaSelection(textarea);
  const selected = text.slice(start, end);
  const cleaned = stripColorMarkup(selected);
  const nextValue = `${text.slice(0, start)}${cleaned}${text.slice(end)}`;
  applyTextareaUpdate(textarea, nextValue, start, start + cleaned.length, onChange);
}

export function prefixCurrentLine(
  textarea: HTMLTextAreaElement,
  prefix: string,
  onChange: (value: string) => void,
): void {
  const { start, text } = getTextareaSelection(textarea);
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const lineEndIndex = text.indexOf("\n", start);
  const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
  const line = text.slice(lineStart, lineEnd);

  let nextLine = line;
  if (prefix === "### ") {
    nextLine = line.startsWith("### ") ? line : `${prefix}${line.replace(/^#{1,3}\s+/, "")}`;
  } else if (prefix === "- ") {
    nextLine = /^[-*•]\s+/.test(line) ? line : `${prefix}${line}`;
  } else {
    nextLine = `${prefix}${line}`;
  }

  const nextValue = `${text.slice(0, lineStart)}${nextLine}${text.slice(lineEnd)}`;
  const offset = nextLine.length - line.length;
  applyTextareaUpdate(textarea, nextValue, start + offset, start + offset, onChange);
}
