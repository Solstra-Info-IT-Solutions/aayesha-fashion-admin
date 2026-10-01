"use client";

import Link from "next/link";
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
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#756d62] transition hover:text-[#2a2520]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </Link>

      <div className="flex items-start gap-3">

        <div>
          <h1 className="text-[#2a2520]">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm leading-6 text-[#756d62]">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}