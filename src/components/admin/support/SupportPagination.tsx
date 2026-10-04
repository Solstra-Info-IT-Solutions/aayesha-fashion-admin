"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type SupportPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(
  page: number,
  totalPages: number,
) {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (page <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "ellipsis",
      totalPages,
    ] as const;
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    page - 1,
    page,
    page + 1,
    "ellipsis",
    totalPages,
  ] as const;
}

export default function SupportPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: SupportPaginationProps) {
  if (totalPages <= 1 && total <= limit) {
    return null;
  }

  const pageNumbers = getPageNumbers(
    page,
    totalPages,
  );

  const start =
    total === 0 ? 0 : (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-4 border-t border-[#2e2a26] pt-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Result Count */}
      <p className="text-sm text-[#cfc7bb]">
        Showing{" "}
        <span className="font-medium text-[#f8f3f1]">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-medium text-[#f8f3f1]">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-[#f8f3f1]">
          {total}
        </span>{" "}
        tickets
      </p>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
        {/* Previous */}
        <button
          type="button"
          onClick={() =>
            onPageChange(page - 1)
          }
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2e2a26] bg-[#1a1816] text-[#cfc7bb] transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={17} />
        </button>

        {/* Desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          {pageNumbers.map((item, index) => {
            if (item === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-sm text-[#cfc7bb]"
                >
                  …
                </span>
              );
            }

            const isActive = item === page;

            return (
              <button
                key={item}
                type="button"
                onClick={() =>
                  onPageChange(item)
                }
                className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#b79a6a] text-[#111111]"
                    : "border border-[#2e2a26] bg-[#1a1816] text-[#f8f3f1] hover:bg-[#111111]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="flex h-9 items-center rounded-lg border border-[#2e2a26] bg-[#1a1816] px-3 text-sm font-medium text-[#f8f3f1] sm:hidden">
          {page} / {totalPages}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() =>
            onPageChange(page + 1)
          }
          disabled={page >= totalPages}
          aria-label="Next page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2e2a26] bg-[#1a1816] text-[#cfc7bb] transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}