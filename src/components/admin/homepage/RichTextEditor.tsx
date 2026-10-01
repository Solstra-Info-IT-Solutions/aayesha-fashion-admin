"use client";

import {
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bold,
  Code2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

/* =========================================================
   RICH TEXT EDITOR
========================================================= */

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "Write your content...",
  minHeight = 180,
}: RichTextEditorProps): ReactElement {
  const editorRef =
    useRef<HTMLDivElement>(null);

  const [mode, setMode] =
    useState<"visual" | "html">(
      "visual",
    );

  const [htmlValue, setHtmlValue] =
    useState(value);

  const [linkUrl, setLinkUrl] =
    useState("");

  useEffect(() => {
    setHtmlValue(value);

    if (
      mode === "visual" &&
      editorRef.current &&
      editorRef.current.innerHTML !== value
    ) {
      editorRef.current.innerHTML =
        value;
    }
  }, [value, mode]);

  /* =======================================================
     VISUAL CHANGE
  ======================================================= */

  function handleVisualChange(): void {
    if (!editorRef.current) {
      return;
    }

    const html =
      editorRef.current.innerHTML;

    setHtmlValue(html);
    onChange(html);
  }

  /* =======================================================
     COMMAND
  ======================================================= */

  function execCommand(
    command: string,
    commandValue?: string,
  ): void {
    editorRef.current?.focus();

    document.execCommand(
      command,
      false,
      commandValue,
    );

    handleVisualChange();
  }

  /* =======================================================
     LINK
  ======================================================= */

  function handleLink(): void {
    const url =
      window.prompt(
        "Enter URL",
        linkUrl,
      );

    if (!url?.trim()) {
      return;
    }

    setLinkUrl(url.trim());

    execCommand(
      "createLink",
      url.trim(),
    );
  }

  /* =======================================================
     HTML CHANGE
  ======================================================= */

  function handleHtmlChange(
    nextValue: string,
  ): void {
    setHtmlValue(nextValue);
    onChange(nextValue);
  }

  /* =======================================================
     MODE SWITCH
  ======================================================= */

  function handleModeChange(
    nextMode: "visual" | "html",
  ): void {
    if (nextMode === mode) {
      return;
    }

    if (
      nextMode === "html" &&
      editorRef.current
    ) {
      const html =
        editorRef.current.innerHTML;

      setHtmlValue(html);
      onChange(html);
    }

    if (
      nextMode === "visual" &&
      editorRef.current
    ) {
      editorRef.current.innerHTML =
        htmlValue;
    }

    setMode(nextMode);
  }

  return (
    <div>
      {/* ===================================================
          LABEL
      =================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
          {label}
        </label>

        {/* MODE SWITCH */}
        <div className="flex border border-[#d6ccb6] bg-[#f7f2e7] p-0.5 rounded-[14px]">
          <button
            type="button"
            onClick={() =>
              handleModeChange(
                "visual",
              )
            }
            className={`px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] transition ${
              mode === "visual"
                ? "bg-[#26221d] text-[#fffdf8]"
                : "text-[#5f584d] hover:text-[#2a2520]"
            }`}
          >
            Visual
          </button>

          <button
            type="button"
            onClick={() =>
              handleModeChange(
                "html",
              )
            }
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] transition ${
              mode === "html"
                ? "bg-[#26221d] text-[#fffdf8]"
                : "text-[#5f584d] hover:text-[#2a2520]"
            }`}
          >
            <Code2 size={12} />

            HTML
          </button>
        </div>
      </div>

      {/* ===================================================
          TOOLBAR
      =================================================== */}

      {mode === "visual" && (
        <div className="mt-2 flex flex-wrap items-center gap-1 border-x border-t border-[#d6ccb6] bg-[#f7f2e7] p-2">
          <ToolbarButton
            label="Bold"
            onClick={() =>
              execCommand("bold")
            }
          >
            <Bold size={15} />
          </ToolbarButton>

          <ToolbarButton
            label="Italic"
            onClick={() =>
              execCommand("italic")
            }
          >
            <Italic size={15} />
          </ToolbarButton>

          <ToolbarButton
            label="Underline"
            onClick={() =>
              execCommand("underline")
            }
          >
            <Underline size={15} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Bullet list"
            onClick={() =>
              execCommand(
                "insertUnorderedList",
              )
            }
          >
            <List size={15} />
          </ToolbarButton>

          <ToolbarButton
            label="Numbered list"
            onClick={() =>
              execCommand(
                "insertOrderedList",
              )
            }
          >
            <ListOrdered size={15} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            label="Add link"
            onClick={handleLink}
          >
            <LinkIcon size={15} />
          </ToolbarButton>

          <select
            defaultValue=""
            onChange={(event) => {
              if (!event.target.value) {
                return;
              }

              execCommand(
                "formatBlock",
                event.target.value,
              );

              event.target.value = "";
            }}
            className="ml-1 h-8 border border-[#d6ccb6] bg-[#fffdf8] px-2 text-[10px] uppercase tracking-[0.1em] text-[#5f584d] outline-none focus:border-[#26221d] rounded-lg"
            aria-label="Text style"
          >
            <option value="">
              Format
            </option>

            <option value="p">
              Paragraph
            </option>

            <option value="h3">
              Heading 3
            </option>

            <option value="h4">
              Heading 4
            </option>
          </select>
        </div>
      )}

      {/* ===================================================
          EDITOR
      =================================================== */}

      {mode === "visual" ? (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleVisualChange}
          data-placeholder={placeholder}
          className="rich-text-editor w-full overflow-y-auto border border-[#d6ccb6] bg-[#fffdf8] px-4 py-3 text-sm leading-7 text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]/20 empty:before:pointer-events-none empty:before:text-[#756d62] empty:before:content-[attr(data-placeholder)] rounded-lg"
          style={{
            minHeight,
          }}
        />
      ) : (
        <textarea
          value={htmlValue}
          onChange={(event) =>
            handleHtmlChange(
              event.target.value,
            )
          }
          placeholder={placeholder}
          spellCheck={false}
          className="w-full resize-y border border-[#d6ccb6] bg-[#fffdf8] px-4 py-3 font-mono text-xs leading-6 text-[#2a2520] outline-none focus:border-[#26221d] focus:ring-1 focus:ring-[#26221d]/20 rounded-lg"
          style={{
            minHeight,
          }}
        />
      )}

      {/* ===================================================
          HELPER
      =================================================== */}

      <p className="mt-2 text-[10px] leading-5 text-[#756d62]">
        Use Visual mode for formatting or HTML mode
        to edit/paste HTML directly.
      </p>
    </div>
  );
}

/* =========================================================
   TOOLBAR BUTTON
========================================================= */

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactElement;
}): ReactElement {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center border border-transparent text-[#5f584d] transition hover:border-[#d6ccb6] hover:bg-[#fffdf8] hover:text-[#26221d] rounded-lg"
    >
      {children}
    </button>
  );
}

/* =========================================================
   TOOLBAR DIVIDER
========================================================= */

function ToolbarDivider(): ReactElement {
  return (
    <span
      aria-hidden="true"
      className="mx-1 h-5 w-px bg-[#e6dfcf]"
    />
  );
}