"use client";

import Link from "next/link";
import { ArrowLeft, Settings2 } from "lucide-react";

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
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </Link>

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <Settings2 className="h-5 w-5 text-gray-500" />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm leading-6 text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}