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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c7a3]">
          Store operations
        </p>

        <h1 className="mt-1 text-[#f8f3f1]">Orders</h1>

        <p className="mt-2 text-sm text-[#cfc7bb]">
          Track payments, fulfilment and customers. Open any order for full details.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[#2e2a26] bg-[#1a1816] px-3.5 py-1.5 text-sm text-[#cfc7bb]">
          <strong className="font-semibold text-[#f8f3f1]">
            {total.toLocaleString("en-IN")}
          </strong>{" "}
          {total === 1 ? "order" : "orders"}
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] transition hover:border-[#b79a6a] disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
    </div>
  );
}
