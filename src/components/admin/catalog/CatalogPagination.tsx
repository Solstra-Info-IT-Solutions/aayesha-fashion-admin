"use client";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export default function CatalogPagination({
  page,
  totalPages,
  total,
  loading,
  onPrevious,
  onNext,
}: Props) {
  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-500">
        {total} total
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={
            loading || page <= 1
          }
          onClick={onPrevious}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-neutral-500">
          Page {page} of{" "}
          {Math.max(
            1,
            totalPages,
          )}
        </span>

        <button
          type="button"
          disabled={
            loading ||
            totalPages === 0 ||
            page >= totalPages
          }
          onClick={onNext}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}