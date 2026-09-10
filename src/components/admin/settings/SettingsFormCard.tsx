"use client";

import type { ReactNode } from "react";

type SettingsFormCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function SettingsFormCard({
  title,
  description,
  children,
}: SettingsFormCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}