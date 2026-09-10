"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type SettingsBackButtonProps = {
  href?: string;
  label?: string;
};

export default function SettingsBackButton({
  href = "/admin/settings",
  label = "Back to Settings",
}: SettingsBackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-800"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}