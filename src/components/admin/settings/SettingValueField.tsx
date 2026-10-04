"use client";

import { useEffect, useState } from "react";
import { Braces, Type } from "lucide-react";

import SettingFormField from "./SettingFormField";

type SettingValueFieldProps = {
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
};

type ValueMode = "text" | "json";

function isObjectValue(value: unknown) {
  return typeof value === "object" && value !== null;
}

function stringifyValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function SettingValueField({
  value,
  onChange,
  error,
}: SettingValueFieldProps) {
  const [mode, setMode] = useState<ValueMode>(
    isObjectValue(value) ? "json" : "text",
  );

  const [textValue, setTextValue] = useState(
    stringifyValue(value),
  );

  useEffect(() => {
    setTextValue(stringifyValue(value));
  }, [value]);

  const handleModeChange = (nextMode: ValueMode) => {
    if (nextMode === mode) return;

    if (nextMode === "json") {
      if (typeof value === "string" && value.trim()) {
        try {
          const parsed = JSON.parse(value);
          onChange(parsed);
          setTextValue(JSON.stringify(parsed, null, 2));
        } catch {
          setTextValue(value);
        }
      } else {
        setTextValue(stringifyValue(value));
      }
    } else {
      setTextValue(stringifyValue(value));
    }

    setMode(nextMode);
  };

  const handleTextChange = (nextValue: string) => {
    setTextValue(nextValue);

    if (mode === "text") {
      onChange(nextValue);
      return;
    }

    if (!nextValue.trim()) {
      onChange(null);
      return;
    }

    try {
      const parsed = JSON.parse(nextValue);
      onChange(parsed);
    } catch {
      // Keep the user's input while they are typing invalid JSON.
      // The parent form can validate before saving.
    }
  };

  return (
    <SettingFormField
      label="Value"
      description={
        mode === "json"
          ? "Enter a valid JSON value."
          : "Enter the setting value as plain text."
      }
      required
      error={error}
    >
      <div className="overflow-hidden rounded-[14px] border border-[#2e2a26] bg-[#1a1816] focus-within:border-[#f8f3f1] focus-within:ring-2 focus-within:ring-[#f8f3f1]/10">
        <div className="flex items-center justify-between border-b border-[#2e2a26] bg-[#111111] px-3 py-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleModeChange("text")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                mode === "text"
                  ? "bg-[#1a1816] text-[#f8f3f1] shadow-sm"
                  : "text-[#9a9185] hover:text-[#e6dfd4]"
              }`}
            >
              <Type className="h-3.5 w-3.5" />
              Text
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("json")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                mode === "json"
                  ? "bg-[#1a1816] text-[#f8f3f1] shadow-sm"
                  : "text-[#9a9185] hover:text-[#e6dfd4]"
              }`}
            >
              <Braces className="h-3.5 w-3.5" />
              JSON
            </button>
          </div>

          <span className="text-xs text-[#9a9185]">
            {textValue.length} characters
          </span>
        </div>

        <textarea
          value={textValue}
          onChange={(event) =>
            handleTextChange(event.target.value)
          }
          rows={mode === "json" ? 12 : 6}
          placeholder={
            mode === "json"
              ? '{\n  "example": "value"\n}'
              : "Enter setting value..."
          }
          className={`w-full resize-y border-0 bg-[#1a1816] px-4 py-3 font-mono text-sm text-[#f8f3f1] outline-none placeholder:text-[#9a9185] ${
            mode === "json" ? "leading-6" : "leading-6"
          }`}
          spellCheck={false}
        />
      </div>

      {mode === "json" && (
        <p className="text-xs text-[#9a9185]">
          Example:{" "}
          <code className="rounded bg-[#211e1b] px-1.5 py-0.5">
            {"{\"enabled\":true}"}
          </code>
        </p>
      )}
    </SettingFormField>
  );
}