"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPagination({
  page,
  totalPages,
  total,
  limit = 25,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit?: number;
  onPageChange: (page: number) => void;
}) {
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
      <p className="text-sm text-[#cfc7bb]">
        Showing <strong className="font-semibold text-[#f8f3f1]">{from}–{to}</strong> of{" "}
        <strong className="font-semibold text-[#f8f3f1]">{total}</strong>
      </p>

      {totalPages > 1 ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#3a352f] bg-[#1a1816] pl-2 pr-3 text-sm font-medium text-[#f8f3f1] transition hover:border-[#b79a6a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={15} /> Previous
          </button>

          <span className="px-2 text-sm text-[#cfc7bb]">
            Page <strong className="text-[#f8f3f1]">{page}</strong> of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#3a352f] bg-[#1a1816] pl-3 pr-2 text-sm font-medium text-[#f8f3f1] transition hover:border-[#b79a6a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
