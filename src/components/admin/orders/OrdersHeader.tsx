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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6a3b]">
          Store operations
        </p>

        <h1 className="mt-1 text-[#2a2520]">Orders</h1>

        <p className="mt-2 text-sm text-[#5f584d]">
          Track payments, fulfilment and customers. Open any order for full details.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[#e6dfcf] bg-[#fffdf8] px-3.5 py-1.5 text-sm text-[#5f584d]">
          <strong className="font-semibold text-[#2a2520]">
            {total.toLocaleString("en-IN")}
          </strong>{" "}
          {total === 1 ? "order" : "orders"}
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-4 text-sm font-semibold text-[#2a2520] transition hover:border-[#b08d57] disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
    </div>
  );
}
