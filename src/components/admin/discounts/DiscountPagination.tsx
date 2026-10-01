"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type DiscountPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export default function DiscountPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: DiscountPaginationProps) {
  if (total === 0 || totalPages <= 1) {
    return null;
  }

  const start =
    (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    total,
  );

  const getPages = () => {
    const pages: (
      number | "ellipsis"
    )[] = [];

    if (totalPages <= 7) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("ellipsis");
    }

    const rangeStart = Math.max(
      2,
      page - 1,
    );

    const rangeEnd = Math.min(
      totalPages - 1,
      page + 1,
    );

    for (
      let i = rangeStart;
      i <= rangeEnd;
      i++
    ) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-col gap-3 border-t border-[#e6dfcf] pt-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Result count */}
      <p className="text-xs text-[#5f584d]">
        Showing{" "}
        <span className="font-medium text-[#2a2520]">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-medium text-[#2a2520]">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-[#2a2520]">
          {total}
        </span>{" "}
        discounts
      </p>

      {/* Pagination */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] bg-[#fffdf8] text-[#5f584d] transition hover:bg-[#f7f2e7] hover:text-[#2a2520] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Pages */}
        <div className="hidden items-center gap-1 sm:flex">
          {getPages().map(
            (item, index) => {
              if (
                item === "ellipsis"
              ) {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-9 w-9 items-center justify-center text-xs text-[#5f584d]"
                  >
                    ...
                  </span>
                );
              }

              const isActive =
                item === page;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    onPageChange(item)
                  }
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-medium transition ${
                    isActive
                      ? "bg-[#26221d] text-white"
                      : "border border-[#e6dfcf] bg-[#fffdf8] text-[#5f584d] hover:bg-[#f7f2e7] hover:text-[#2a2520]"
                  }`}
                  aria-current={
                    isActive
                      ? "page"
                      : undefined
                  }
                >
                  {item}
                </button>
              );
            },
          )}
        </div>

        {/* Mobile page indicator */}
        <span className="px-3 text-xs text-[#5f584d] sm:hidden">
          Page{" "}
          <span className="font-medium text-[#2a2520]">
            {page}
          </span>{" "}
          of{" "}
          <span className="font-medium text-[#2a2520]">
            {totalPages}
          </span>
        </span>

        {/* Next */}
        <button
          type="button"
          disabled={
            page >= totalPages
          }
          onClick={() =>
            onPageChange(page + 1)
          }
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] bg-[#fffdf8] text-[#5f584d] transition hover:bg-[#f7f2e7] hover:text-[#2a2520] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}