"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import type { OrderPagination } from "@/types/order";

export function OrdersPagination({
  pagination,
  onPageChange,
}: {
  pagination: OrderPagination;
  onPageChange: (page: number) => void;
}) {
  if (pagination.total === 0) return null;

  const from = (pagination.page - 1) * pagination.limit + 1;
  const to = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
      <p className="text-sm text-[#5f584d]">
        Showing{" "}
        <strong className="font-semibold text-[#2a2520]">
          {from}–{to}
        </strong>{" "}
        of <strong className="font-semibold text-[#2a2520]">{pagination.total}</strong>
      </p>

      {pagination.totalPages > 1 ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!pagination.hasPreviousPage}
            onClick={() => onPageChange(pagination.page - 1)}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#d6ccb6] bg-[#fffdf8] pl-2 pr-3 text-sm font-medium text-[#2a2520] transition hover:border-[#b08d57] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={15} /> Previous
          </button>

          <span className="px-2 text-sm text-[#5f584d]">
            Page <strong className="text-[#2a2520]">{pagination.page}</strong> of {pagination.totalPages}
          </span>

          <button
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() => onPageChange(pagination.page + 1)}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#d6ccb6] bg-[#fffdf8] pl-3 pr-2 text-sm font-medium text-[#2a2520] transition hover:border-[#b08d57] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
