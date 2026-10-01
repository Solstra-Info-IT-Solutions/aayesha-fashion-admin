"use client";

import { SmartBackLink } from "@/components/navigation/smart-back-link";
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
    <SmartBackLink
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-[#756d62] transition hover:text-[#2a2520]"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </SmartBackLink>
  );
}