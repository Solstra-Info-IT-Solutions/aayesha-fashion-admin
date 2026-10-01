"use client";

export default function SettingsFormSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-28 rounded bg-[#e6dfcf]" />
        <div className="h-4 w-72 rounded bg-[#efe8d8]" />
      </div>

      <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-5 shadow-sm sm:p-6">
        <div className="mb-6 space-y-3">
          <div className="h-5 w-36 rounded bg-[#e6dfcf]" />
          <div className="h-4 w-80 rounded bg-[#efe8d8]" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-[#e6dfcf]" />
            <div className="h-11 w-full rounded-[14px] bg-[#efe8d8]" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-[#e6dfcf]" />
            <div className="h-11 w-full rounded-[14px] bg-[#efe8d8]" />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-4 w-16 rounded bg-[#e6dfcf]" />
          <div className="h-48 w-full rounded-[14px] bg-[#efe8d8]" />
        </div>

        <div className="mt-6 h-20 w-full rounded-[14px] bg-[#efe8d8]" />

        <div className="mt-6 flex justify-end gap-3 border-t border-[#e6dfcf] pt-5">
          <div className="h-11 w-24 rounded-[14px] bg-[#efe8d8]" />
          <div className="h-11 w-32 rounded-[14px] bg-[#e6dfcf]" />
        </div>
      </div>
    </div>
  );
}