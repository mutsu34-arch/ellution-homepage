"use client";

import {
  clearColorInSelection,
  prefixCurrentLine,
  wrapTextareaSelection,
} from "@/lib/post-editor";

type PostEditorToolbarProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
};

type ToolbarButton = {
  label: string;
  title: string;
  className?: string;
  onClick: () => void;
};

export function PostEditorToolbar({ textareaRef, onChange }: PostEditorToolbarProps) {
  function withTextarea(action: (textarea: HTMLTextAreaElement) => void) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    action(textarea);
  }

  const buttons: ToolbarButton[] = [
    {
      label: "굵게",
      title: "굵게 (**텍스트**)",
      onClick: () =>
        withTextarea((textarea) => wrapTextareaSelection(textarea, "**", "**", onChange)),
    },
    {
      label: "밑줄",
      title: "밑줄 (__텍스트__)",
      onClick: () =>
        withTextarea((textarea) => wrapTextareaSelection(textarea, "__", "__", onChange)),
    },
    {
      label: "파랑",
      title: "파란색 ({{blue}}텍스트{{/blue}})",
      className: "border-[#1e40af] text-[#1e40af] hover:bg-blue-50",
      onClick: () =>
        withTextarea((textarea) =>
          wrapTextareaSelection(textarea, "{{blue}}", "{{/blue}}", onChange),
        ),
    },
    {
      label: "빨강",
      title: "빨간색 ({{red}}텍스트{{/red}})",
      className: "border-[#dc2626] text-[#dc2626] hover:bg-red-50",
      onClick: () =>
        withTextarea((textarea) =>
          wrapTextareaSelection(textarea, "{{red}}", "{{/red}}", onChange),
        ),
    },
    {
      label: "색상해제",
      title: "선택 영역의 색상 표시 제거",
      onClick: () => withTextarea((textarea) => clearColorInSelection(textarea, onChange)),
    },
    {
      label: "List",
      title: "목록 (- 항목)",
      onClick: () => withTextarea((textarea) => prefixCurrentLine(textarea, "- ", onChange)),
    },
    {
      label: "H3",
      title: "작은 소제목 (### 제목)",
      onClick: () => withTextarea((textarea) => prefixCurrentLine(textarea, "### ", onChange)),
    },
  ];

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {buttons.map((button) => (
        <button
          key={button.label}
          type="button"
          title={button.title}
          onClick={button.onClick}
          className={`rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 ${
            button.className ?? ""
          }`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
