"use client";

import { Bell } from "lucide-react";

export function NotificationBell() {
  return (
    <button
      type="button"
      className="relative inline-flex h-10 w-10 items-center justify-center border border-[#e7e2dd] bg-white text-[#6f706f] transition hover:text-[#171717]"
      aria-label="Notifications"
    >
      <Bell
        size={18}
        strokeWidth={1.7}
      />

      <span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#d98791]" />
    </button>
  );
}