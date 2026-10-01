"use client";

export default function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-[#e6dfcf]" />

          <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-[14px] bg-[#e6dfcf]" />

            <div className="space-y-2">
              <div className="h-7 w-32 animate-pulse rounded bg-[#e6dfcf]" />
              <div className="h-4 w-64 animate-pulse rounded bg-[#e6dfcf]" />
            </div>
          </div>
        </div>

        <div className="h-10 w-24 animate-pulse rounded-lg bg-[#e6dfcf]" />
      </div>

      {/* Filter skeleton */}
      <div className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-[#e6dfcf]" />
            <div className="h-3 w-52 animate-pulse rounded bg-[#e6dfcf]" />
          </div>

          <div className="h-10 w-48 animate-pulse rounded-lg bg-[#e6dfcf]" />
        </div>
      </div>

      {/* Settings skeleton */}
      <div className="overflow-hidden rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm">
        <div className="border-b border-[#e6dfcf] bg-[#f7f2e7]/70 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-[#e6dfcf]" />

            <div className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-[#e6dfcf]" />
              <div className="h-3 w-20 animate-pulse rounded bg-[#e6dfcf]" />
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#efe8d8]">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-4 w-48 animate-pulse rounded bg-[#e6dfcf]" />

                  <div className="h-20 w-full animate-pulse rounded-[14px] bg-[#efe8d8]" />

                  <div className="h-3 w-40 animate-pulse rounded bg-[#e6dfcf]" />
                </div>

                <div className="h-6 w-11 animate-pulse rounded-full bg-[#e6dfcf]" />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}