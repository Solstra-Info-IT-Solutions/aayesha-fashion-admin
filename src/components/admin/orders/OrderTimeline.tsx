import type { AdminOrder } from "@/types/order";

const DOT: Record<string, string> = {
  delivered: "bg-[#2a9a68]",
  cancelled: "bg-[#c2372e]",
  returned: "bg-[#6a58c4]",
  exchanged: "bg-[#6a58c4]",
  shipped: "bg-[#1f77a8]",
  in_transit: "bg-[#1f77a8]",
  out_for_delivery: "bg-[#1f77a8]",
  processing: "bg-[#d29a0a]",
  packed: "bg-[#d29a0a]",
};

const stamp = (value?: string) =>
  value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";

export function OrderTimeline({ order }: { order: AdminOrder }) {
  const history = (order.statusHistory ?? []).slice().reverse();

  return (
    <section className="surface p-5 sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#756d62]">Activity</p>
      <h2 className="display mt-1 text-[26px] font-semibold leading-none text-[#2a2520]">Order timeline</h2>

      {history.length === 0 ? (
        <p className="mt-6 text-sm text-[#756d62]">No status history available.</p>
      ) : (
        <ol className="mt-6">
          {history.map((item, index) => (
            <li key={`${item.status}-${item.changedAt}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
              {index < history.length - 1 ? (
                <span className="absolute left-[5px] top-4 h-full w-px bg-[#e6dfcf]" aria-hidden="true" />
              ) : null}

              <span
                className={`relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full ring-4 ring-[#fffdf8] ${
                  DOT[item.status] ?? "bg-[#b08d57]"
                }`}
              />

              <div className="min-w-0">
                <p className="text-sm font-semibold capitalize text-[#2a2520]">{item.status.replace(/_/g, " ")}</p>

                {item.note ? <p className="mt-0.5 text-sm leading-6 text-[#5f584d]">{item.note}</p> : null}

                <p className="mt-0.5 text-xs text-[#756d62]">{stamp(item.changedAt)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
