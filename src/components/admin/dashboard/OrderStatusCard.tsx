import type {
  OrderStatusSummary,
} from "@/types/dashboard";

export function OrderStatusCard({
  statuses,
  loading,
}: {
  statuses: OrderStatusSummary[];
  loading?: boolean;
}) {
  const total = statuses.reduce(
    (sum, item) =>
      sum + item.count,
    0,
  );

  return (
    <section className="border border-[#e5e7ec] bg-[#ffffff] p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-[#737a8c]">
        Orders
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#1a1d24]">
        Order status
      </h2>

      <div className="mt-7 space-y-4">
        {loading ? (
          <p className="text-sm text-[#737a8c]">
            Loading...
          </p>
        ) : statuses.length === 0 ? (
          <p className="text-sm text-[#737a8c]">
            No order data available.
          </p>
        ) : (
          statuses.map(
            (status) => {
              const percent =
                total > 0
                  ? Math.round(
                      (status.count /
                        total) *
                        100,
                    )
                  : 0;

              return (
                <div
                  key={status.status}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize text-[#5b6270]">
                      {status.status.replace(
                        /_/g,
                        " ",
                      )}
                    </span>

                    <span className="font-medium text-[#1a1d24]">
                      {status.count}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 bg-[#e5e7ec]">
                    <div
                      className="h-full bg-[#2b3a55]"
                      style={{
                        width: `${percent}%`,
                      }}
                    />
                  </div>
                </div>
              );
            },
          )
        )}
      </div>
    </section>
  );
}