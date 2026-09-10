"use client";

export default function DiscountTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="border-b border-[var(--color-border)] bg-gray-50/80 px-5 py-4">
          <div className="grid grid-cols-7 gap-5">
            {[
              "Coupon",
              "Discount",
              "Usage",
              "Start",
              "End",
              "Status",
              "Actions",
            ].map((item) => (
              <div
                key={item}
                className="h-3 w-16 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        </div>

        <div>
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="grid grid-cols-7 items-center gap-5 border-b border-[var(--color-border)] px-5 py-5 last:border-b-0"
              >
                {/* Coupon */}
                <div>
                  <div className="h-7 w-28 animate-pulse rounded-md bg-gray-200" />
                  <div className="mt-2 h-3 w-36 animate-pulse rounded bg-gray-100" />
                </div>

                {/* Discount */}
                <div>
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
                </div>

                {/* Usage */}
                <div>
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
                </div>

                {/* Start */}
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

                {/* End */}
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

                {/* Status */}
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />

                {/* Actions */}
                <div className="flex justify-end gap-1">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="space-y-3 p-3 lg:hidden">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="rounded-xl border border-[var(--color-border)] p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-full">
                  <div className="h-7 w-28 animate-pulse rounded-md bg-gray-200" />

                  <div className="mt-2 h-3 w-44 animate-pulse rounded bg-gray-100" />

                  <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-100" />
                </div>

                <div className="h-6 w-16 shrink-0 animate-pulse rounded-full bg-gray-200" />
              </div>

              {/* Discount + Usage */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-5 w-20 animate-pulse rounded bg-gray-200" />
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-5 w-24 animate-pulse rounded bg-gray-200" />
                </div>
              </div>

              {/* Details */}
              <div className="mt-4 space-y-3 border-t border-[var(--color-border)] pt-4">
                <div className="flex justify-between">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                </div>

                <div className="flex justify-between">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 border-t border-[var(--color-border)] pt-4">
                <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}