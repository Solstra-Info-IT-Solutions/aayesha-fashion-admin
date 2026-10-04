"use client";

import { SmartBackLink } from "@/components/navigation/smart-back-link";
import { ArrowLeft } from "lucide-react";

type SettingsFormHeaderProps = {
  title: string;
  description?: string;
  backHref?: string;
};

export default function SettingsFormHeader({
  title,
  description,
  backHref = "/admin/settings",
}: SettingsFormHeaderProps) {
  return (
    <div className="mb-6">
      <SmartBackLink
        href={backHref}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#9a9185] transition hover:text-[#f8f3f1]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </SmartBackLink>

      <div className="flex items-start gap-3">

        <div>
          <h1 className="text-[#f8f3f1]">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm leading-6 text-[#9a9185]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}