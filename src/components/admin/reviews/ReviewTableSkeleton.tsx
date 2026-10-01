"use client";

export default function ReviewTableSkeleton() {
  return (
    <>
      {/* Desktop Skeleton */}
      <div className="hidden overflow-hidden rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-[#e6dfcf] bg-[#f7f2e7]/70">
                {[
                  "Review",
                  "Rating",
                  "Product",
                  "Status",
                  "Featured",
                  "Date",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#5f584d]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e6dfcf]">
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index}>
                  {/* Review */}
                  <td className="px-5 py-5">
                    <div className="space-y-2">
                      <div className="h-4 w-48 animate-pulse rounded bg-[#efe8d8]" />
                      <div className="h-3 w-72 animate-pulse rounded bg-[#efe8d8]" />
                      <div className="h-3 w-40 animate-pulse rounded bg-[#efe8d8]" />
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-5 py-5">
                    <div className="space-y-2">
                      <div className="h-3 w-24 animate-pulse rounded bg-[#efe8d8]" />
                      <div className="h-3 w-8 animate-pulse rounded bg-[#efe8d8]" />
                    </div>
                  </td>

                  {/* Product */}
                  <td className="px-5 py-5">
                    <div className="h-4 w-28 animate-pulse rounded bg-[#efe8d8]" />
                  </td>

                  {/* Status */}
                  <td className="px-5 py-5">
                    <div className="h-7 w-20 animate-pulse rounded-full bg-[#efe8d8]" />
                  </td>

                  {/* Featured */}
                  <td className="px-5 py-5">
                    <div className="h-9 w-9 animate-pulse rounded-lg bg-[#efe8d8]" />
                  </td>

                  {/* Date */}
                  <td className="px-5 py-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-[#efe8d8]" />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-5">
                    <div className="flex justify-end gap-2">
                      <div className="h-9 w-9 animate-pulse rounded-lg bg-[#efe8d8]" />
                      <div className="h-9 w-9 animate-pulse rounded-lg bg-[#efe8d8]" />
                      <div className="h-9 w-9 animate-pulse rounded-lg bg-[#efe8d8]" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="space-y-3 lg:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[14px] border border-[#e6dfcf] bg-[#fffdf8] p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-[#efe8d8]" />
                <div className="h-3 w-full animate-pulse rounded bg-[#efe8d8]" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-[#efe8d8]" />
              </div>

              <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-[#efe8d8]" />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-4 w-24 animate-pulse rounded bg-[#efe8d8]" />
              <div className="h-7 w-20 animate-pulse rounded-full bg-[#efe8d8]" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-[14px] bg-[#f7f2e7] p-3">
              <div className="space-y-2">
                <div className="h-2.5 w-12 animate-pulse rounded bg-[#e6dfcf]" />
                <div className="h-3.5 w-24 animate-pulse rounded bg-[#e6dfcf]" />
              </div>

              <div className="space-y-2">
                <div className="h-2.5 w-10 animate-pulse rounded bg-[#e6dfcf]" />
                <div className="h-3.5 w-20 animate-pulse rounded bg-[#e6dfcf]" />
              </div>

              <div className="space-y-2">
                <div className="h-2.5 w-12 animate-pulse rounded bg-[#e6dfcf]" />
                <div className="h-3.5 w-24 animate-pulse rounded bg-[#e6dfcf]" />
              </div>

              <div className="space-y-2">
                <div className="h-2.5 w-10 animate-pulse rounded bg-[#e6dfcf]" />
                <div className="h-3.5 w-20 animate-pulse rounded bg-[#e6dfcf]" />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <div className="h-9 flex-1 animate-pulse rounded-lg bg-[#efe8d8]" />
              <div className="h-9 flex-1 animate-pulse rounded-lg bg-[#efe8d8]" />
              <div className="h-9 w-9 animate-pulse rounded-lg bg-[#efe8d8]" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}