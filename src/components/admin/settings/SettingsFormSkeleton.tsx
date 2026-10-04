"use client";

export default function SettingsFormSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-28 rounded bg-[#2e2a26]" />
        <div className="h-4 w-72 rounded bg-[#211e1b]" />
      </div>

      <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816] p-5 shadow-sm sm:p-6">
        <div className="mb-6 space-y-3">
          <div className="h-5 w-36 rounded bg-[#2e2a26]" />
          <div className="h-4 w-80 rounded bg-[#211e1b]" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-[#2e2a26]" />
            <div className="h-11 w-full rounded-[14px] bg-[#211e1b]" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-[#2e2a26]" />
            <div className="h-11 w-full rounded-[14px] bg-[#211e1b]" />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-4 w-16 rounded bg-[#2e2a26]" />
          <div className="h-48 w-full rounded-[14px] bg-[#211e1b]" />
        </div>

        <div className="mt-6 h-20 w-full rounded-[14px] bg-[#211e1b]" />

        <div className="mt-6 flex justify-end gap-3 border-t border-[#2e2a26] pt-5">
          <div className="h-11 w-24 rounded-[14px] bg-[#211e1b]" />
          <div className="h-11 w-32 rounded-[14px] bg-[#2e2a26]" />
        </div>
      </div>
    </div>
  );
}