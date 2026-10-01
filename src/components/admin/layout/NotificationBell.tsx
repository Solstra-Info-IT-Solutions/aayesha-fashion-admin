"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

/** Shortcut to the dashboard's "needs attention" overview. */
export function NotificationBell() {
  return (
    <Link
      href="/admin"
      className="relative inline-flex h-10 w-10 items-center justify-center border border-[#e6dfcf] bg-[#fffdf8] text-[#5f584d] transition hover:border-[#bdb199] hover:text-[#2a2520]"
      aria-label="Needs attention"
      title="Needs attention"
    >
      <Bell size={18} strokeWidth={1.6} />
    </Link>
  );
}
