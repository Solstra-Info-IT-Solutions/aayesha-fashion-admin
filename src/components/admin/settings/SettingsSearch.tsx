"use client";

import { Search, X } from "lucide-react";

type SettingsSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SettingsSearch({
  value,
  onChange,
  placeholder = "Search settings...",
}: SettingsSearchProps) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#756d62]" />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[#e6dfcf] bg-[#fffdf8] pl-9 pr-9 text-sm text-[#3d372f] outline-none transition placeholder:text-[#756d62] focus:border-[#756d62] focus:ring-2 focus:ring-[#efe8d8]"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#756d62] hover:bg-[#efe8d8] hover:text-[#5f584d]"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}