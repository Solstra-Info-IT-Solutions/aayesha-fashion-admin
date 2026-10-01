import { RefreshCw } from "lucide-react";

export function OrdersHeader({
  total,
  loading,
  onRefresh,
}: {
  total: number;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[#958781]">
          Store operations
        </p>

        <h1 className="mt-1 font-serif text-4xl text-[#3f2d2a]">
          Orders
        </h1>

        <p className="mt-2 text-sm text-[#70635d]">
          Manage customer orders, payments,
          shipping and fulfilment.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-[#70635d]">
          {total.toLocaleString("en-IN")} orders
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 border border-[#d8cec5] bg-[#fbf9f5] px-4 text-sm text-[#3f2d2a] hover:border-[#3f2d2a] disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>
    </div>
  );
}