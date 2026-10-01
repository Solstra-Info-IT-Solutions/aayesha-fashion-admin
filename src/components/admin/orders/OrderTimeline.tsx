import type {
  AdminOrder,
} from "@/types/order";

export function OrderTimeline({
  order,
}: {
  order: AdminOrder;
}) {
  const history =
    order.statusHistory ?? [];

  if (history.length === 0) {
    return (
      <section className="border border-[#e6dfcf] bg-[#fffdf8] p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#756d62]">
          Activity
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#2a2520]">
          Order timeline
        </h2>

        <p className="mt-6 text-sm text-[#756d62]">
          No status history available.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-[#e6dfcf] bg-[#fffdf8] p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#756d62]">
        Activity
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#2a2520]">
        Order timeline
      </h2>

      <div className="mt-7 space-y-6">
        {history
          .slice()
          .reverse()
          .map(
            (item, index) => (
              <div
                key={`${item.status}-${item.changedAt}-${index}`}
                className="relative flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#2a2520]" />

                  {index <
                    history.length -
                      1 && (
                    <span className="mt-2 h-full w-px bg-[#e6dfcf]" />
                  )}
                </div>

                <div className="pb-2">
                  <p className="text-sm font-medium capitalize text-[#2a2520]">
                    {item.status.replace(
                      /_/g,
                      " ",
                    )}
                  </p>

                  {item.note && (
                    <p className="mt-1 text-sm leading-6 text-[#5f584d]">
                      {item.note}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-[#756d62]">
                    {item.changedAt
                      ? new Intl.DateTimeFormat(
                          "en-IN",
                          {
                            dateStyle:
                              "medium",
                            timeStyle:
                              "short",
                          },
                        ).format(
                          new Date(
                            item.changedAt,
                          ),
                        )
                      : "—"}
                  </p>
                </div>
              </div>
            ),
          )}
      </div>
    </section>
  );
}