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
      className="inline-flex items-center gap-2 text-sm font-medium text-[#9a9185] transition hover:text-[#f8f3f1]"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </SmartBackLink>
  );
}