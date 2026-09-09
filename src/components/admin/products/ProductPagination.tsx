"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ProductPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (
    page: number,
  ) => void;
}

export default function ProductPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: ProductPaginationProps) {
  if (total === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-[#6f706f]">
        Page {page} of{" "}
        {Math.max(
          totalPages,
          1,
        )}{" "}
        · {total} products
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={
            page <= 1
          }
          onClick={() =>
            onPageChange(
              page - 1,
            )
          }
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#d8d1ca] px-3 text-xs font-medium text-[#292c2c] disabled:opacity-40"
        >
          <ChevronLeft
            size={14}
          />
          Previous
        </button>

        <button
          type="button"
          disabled={
            page >=
            totalPages
          }
          onClick={() =>
            onPageChange(
              page + 1,
            )
          }
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#d8d1ca] px-3 text-xs font-medium text-[#292c2c] disabled:opacity-40"
        >
          Next
          <ChevronRight
            size={14}
          />
        </button>
      </div>
    </div>
  );
}