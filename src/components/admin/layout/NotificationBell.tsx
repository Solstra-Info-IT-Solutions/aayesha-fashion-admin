"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

/** Shortcut to the dashboard's "needs attention" overview. */
export function NotificationBell() {
  return (
    <Link
      href="/admin"
      className="relative inline-flex h-10 w-10 items-center justify-center border border-[#2e2a26] bg-[#1a1816] text-[#cfc7bb] transition hover:border-[#4a443d] hover:text-[#f8f3f1]"
      aria-label="Needs attention"
      title="Needs attention"
    >
      <Bell size={18} strokeWidth={1.6} />
    </Link>
  );
}
