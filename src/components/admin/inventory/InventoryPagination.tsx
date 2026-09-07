import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { InventoryPagination as Pagination } from "@/types/inventory";

interface InventoryPaginationProps {
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
}

export default function InventoryPagination({
  pagination,
  onPageChange,
}: InventoryPaginationProps) {
  if (
    !pagination ||
    pagination.totalPages <= 1
  ) {
    return null;
  }

  const start =
    (pagination.page - 1) * pagination.limit + 1;

  const end = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );

  const previousDisabled =
    pagination.page <= 1;

  const nextDisabled =
    pagination.page >= pagination.totalPages;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e7e2dd] bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#6f706f]">
        Showing{" "}
        <span className="font-medium text-[#292c2c]">
          {start}
        </span>
        {" – "}
        <span className="font-medium text-[#292c2c]">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-[#292c2c]">
          {pagination.total}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={previousDisabled}
          onClick={() =>
            onPageChange(pagination.page - 1)
          }
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#d8d1ca] px-3 text-sm font-medium text-[#292c2c] hover:bg-[#fcfbf9] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="px-2 text-sm text-[#6f706f]">
          Page {pagination.page} of{" "}
          {pagination.totalPages}
        </span>

        <button
          type="button"
          disabled={nextDisabled}
          onClick={() =>
            onPageChange(pagination.page + 1)
          }
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-[#d8d1ca] px-3 text-sm font-medium text-[#292c2c] hover:bg-[#fcfbf9] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}