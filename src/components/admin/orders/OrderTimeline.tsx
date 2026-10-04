import type { AdminOrder } from "@/types/order";

const DOT: Record<string, string> = {
  delivered: "bg-[#8fb08a]",
  cancelled: "bg-[#e08b84]",
  returned: "bg-[#b4a8f0]",
  exchanged: "bg-[#b4a8f0]",
  shipped: "bg-[#8fbfdc]",
  in_transit: "bg-[#8fbfdc]",
  out_for_delivery: "bg-[#8fbfdc]",
  processing: "bg-[#e0b56a]",
  packed: "bg-[#e0b56a]",
};

const stamp = (value?: string) =>
  value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";

export function OrderTimeline({ order }: { order: AdminOrder }) {
  const history = (order.statusHistory ?? []).slice().reverse();

  return (
    <section className="surface p-5 sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a9185]">Activity</p>
      <h2 className="display mt-1 text-[26px] font-semibold leading-none text-[#f8f3f1]">Order timeline</h2>

      {history.length === 0 ? (
        <p className="mt-6 text-sm text-[#9a9185]">No status history available.</p>
      ) : (
        <ol className="mt-6">
          {history.map((item, index) => (
            <li key={`${item.status}-${item.changedAt}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
              {index < history.length - 1 ? (
                <span className="absolute left-[5px] top-4 h-full w-px bg-[#2e2a26]" aria-hidden="true" />
              ) : null}

              <span
                className={`relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full ring-4 ring-[#1a1816] ${
                  DOT[item.status] ?? "bg-[#b79a6a]"
                }`}
              />

              <div className="min-w-0">
                <p className="text-sm font-semibold capitalize text-[#f8f3f1]">{item.status.replace(/_/g, " ")}</p>

                {item.note ? <p className="mt-0.5 text-sm leading-6 text-[#cfc7bb]">{item.note}</p> : null}

                <p className="mt-0.5 text-xs text-[#9a9185]">{stamp(item.changedAt)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
