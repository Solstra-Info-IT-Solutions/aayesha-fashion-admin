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
      <section className="border border-[#e7e2dd] bg-white p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
          Activity
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#171717]">
          Order timeline
        </h2>

        <p className="mt-6 text-sm text-[#969696]">
          No status history available.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-[#e7e2dd] bg-white p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
        Activity
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#171717]">
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
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#292c2c]" />

                  {index <
                    history.length -
                      1 && (
                    <span className="mt-2 h-full w-px bg-[#e7e2dd]" />
                  )}
                </div>

                <div className="pb-2">
                  <p className="text-sm font-medium capitalize text-[#171717]">
                    {item.status.replace(
                      /_/g,
                      " ",
                    )}
                  </p>

                  {item.note && (
                    <p className="mt-1 text-sm leading-6 text-[#6f706f]">
                      {item.note}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-[#969696]">
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