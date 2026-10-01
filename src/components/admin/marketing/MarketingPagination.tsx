"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type MarketingPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export default function MarketingPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: MarketingPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (page > 4) {
      pages.push("...");
    }

    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(totalPages - 1, page + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (page < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

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
        campaigns
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:border-[#6f542f] hover:text-[#6f542f] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Pages */}
        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((item, index) =>
            item === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-[#5f584d]"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                  item === page
                    ? "bg-[#6f542f] text-white"
                    : "border border-[#e6dfcf] text-[#5f584d] hover:border-[#6f542f] hover:text-[#6f542f]"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </div>

        {/* Mobile page indicator */}
        <div className="flex h-9 items-center rounded-lg border border-[#e6dfcf] px-3 text-xs text-[#5f584d] sm:hidden">
          Page{" "}
          <span className="mx-1 font-semibold text-[#2a2520]">
            {page}
          </span>
          of {totalPages}
        </div>

        {/* Next */}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e6dfcf] text-[#5f584d] transition hover:border-[#6f542f] hover:text-[#6f542f] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}