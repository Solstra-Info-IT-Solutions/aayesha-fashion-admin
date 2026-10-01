"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

/** Shortcut to the dashboard's "needs attention" overview. */
export function NotificationBell() {
  return (
    <Link
      href="/admin"
      className="relative inline-flex h-10 w-10 items-center justify-center border border-[#e6ddd4] bg-[#fbf9f5] text-[#70635d] transition hover:border-[#b9aaa1] hover:text-[#3f2d2a]"
      aria-label="Needs attention"
      title="Needs attention"
    >
      <Bell size={18} strokeWidth={1.6} />
    </Link>
  );
}
