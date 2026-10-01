"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

/** Shortcut to the dashboard's "needs attention" overview. */
export function NotificationBell() {
  return (
    <Link
      href="/admin"
      className="relative inline-flex h-10 w-10 items-center justify-center border border-[#e5e7ec] bg-[#ffffff] text-[#5b6270] transition hover:border-[#b4bac6] hover:text-[#1a1d24]"
      aria-label="Needs attention"
      title="Needs attention"
    >
      <Bell size={18} strokeWidth={1.6} />
    </Link>
  );
}
