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
    <section className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] shadow-sm">
      <div className="border-b border-[#2e2a26] px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-[#f8f3f1]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm leading-6 text-[#9a9185]">
            {description}
          </p>
        )}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}