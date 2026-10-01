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
      <div className="overflow-hidden rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] focus-within:border-[#26221d] focus-within:ring-2 focus-within:ring-[#26221d]/10">
        <div className="flex items-center justify-between border-b border-[#e6dfcf] bg-[#f7f2e7] px-3 py-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleModeChange("text")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                mode === "text"
                  ? "bg-[#fffdf8] text-[#2a2520] shadow-sm"
                  : "text-[#756d62] hover:text-[#3d372f]"
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
                  ? "bg-[#fffdf8] text-[#2a2520] shadow-sm"
                  : "text-[#756d62] hover:text-[#3d372f]"
              }`}
            >
              <Braces className="h-3.5 w-3.5" />
              JSON
            </button>
          </div>

          <span className="text-xs text-[#756d62]">
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
          className={`w-full resize-y border-0 bg-[#fffdf8] px-4 py-3 font-mono text-sm text-[#2a2520] outline-none placeholder:text-[#756d62] ${
            mode === "json" ? "leading-6" : "leading-6"
          }`}
          spellCheck={false}
        />
      </div>

      {mode === "json" && (
        <p className="text-xs text-[#756d62]">
          Example:{" "}
          <code className="rounded bg-[#efe8d8] px-1.5 py-0.5">
            {"{\"enabled\":true}"}
          </code>
        </p>
      )}
    </SettingFormField>
  );
}