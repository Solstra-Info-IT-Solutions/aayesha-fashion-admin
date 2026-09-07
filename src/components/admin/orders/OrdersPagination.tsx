"use client";

import type {
  OrderPagination,
} from "@/types/order";

export function OrdersPagination({
  pagination,
  onPageChange,
}: {
  pagination: OrderPagination;
  onPageChange: (
    page: number,
  ) => void;
}) {
  if (
    pagination.totalPages <= 1
  ) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between gap-3 border-t border-[#e7e2dd] bg-white px-5 py-4 sm:flex-row sm:items-center">
      <p className="text-xs text-[#969696]">
        Page {pagination.page} of{" "}
        {pagination.totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={
            !pagination.hasPreviousPage
          }
          onClick={() =>
            onPageChange(
              pagination.page -
                1,
            )
          }
          className="h-9 border border-[#d8d1ca] px-3 text-xs text-[#292c2c] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span className="px-2 text-xs text-[#6f706f]">
          {pagination.page}
        </span>

        <button
          type="button"
          disabled={
            !pagination.hasNextPage
          }
          onClick={() =>
            onPageChange(
              pagination.page +
                1,
            )
          }
          className="h-9 border border-[#d8d1ca] px-3 text-xs text-[#292c2c] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}