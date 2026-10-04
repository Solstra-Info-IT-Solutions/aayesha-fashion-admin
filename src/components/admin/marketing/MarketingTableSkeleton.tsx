"use client";

export default function MarketingTableSkeleton() {
  return (
    <div className="rounded-[14px] border border-[#2e2a26] bg-[#1a1816]">
      {/* Desktop */}
      <div className="hidden overflow-hidden md:block">
        <div className="border-b border-[#2e2a26] bg-[#111111]/70 px-5 py-4">
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="h-3 animate-pulse rounded bg-[#2e2a26]"
              />
            ))}
          </div>
        </div>

        <div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-7 gap-4 border-b border-[#2e2a26] px-5 py-5 last:border-b-0"
            >
              {Array.from({ length: 7 }).map((_, cellIndex) => (
                <div key={cellIndex}>
                  <div
                    className={`h-4 animate-pulse rounded bg-[#2e2a26] ${
                      cellIndex === 0
                        ? "w-40"
                        : "w-20"
                    }`}
                  />

                  {cellIndex === 0 && (
                    <div className="mt-2 h-3 w-28 animate-pulse rounded bg-[#211e1b]" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-3 p-3 md:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[14px] border border-[#2e2a26] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="h-5 w-40 animate-pulse rounded bg-[#2e2a26]" />
                <div className="mt-2 h-3 w-32 animate-pulse rounded bg-[#211e1b]" />
              </div>

              <div className="h-6 w-20 animate-pulse rounded-full bg-[#2e2a26]" />
            </div>

            <div className="mt-4 h-6 w-16 animate-pulse rounded bg-[#211e1b]" />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="h-16 animate-pulse rounded-lg bg-[#211e1b]" />
              <div className="h-16 animate-pulse rounded-lg bg-[#211e1b]" />
            </div>

            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-[#211e1b]" />

            <div className="mt-4 flex gap-2 border-t border-[#2e2a26] pt-4">
              <div className="h-9 flex-1 animate-pulse rounded-lg bg-[#211e1b]" />
              <div className="h-9 w-9 animate-pulse rounded-lg bg-[#211e1b]" />
              <div className="h-9 w-9 animate-pulse rounded-lg bg-[#211e1b]" />
              <div className="h-9 w-9 animate-pulse rounded-lg bg-[#211e1b]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}