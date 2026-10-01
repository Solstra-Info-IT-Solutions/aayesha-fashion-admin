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
    <section className="border border-[#e6ddd4] bg-[#fbf9f5] p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-[#958781]">
        Orders
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#3f2d2a]">
        Order status
      </h2>

      <div className="mt-7 space-y-4">
        {loading ? (
          <p className="text-sm text-[#958781]">
            Loading...
          </p>
        ) : statuses.length === 0 ? (
          <p className="text-sm text-[#958781]">
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
                    <span className="capitalize text-[#70635d]">
                      {status.status.replace(
                        /_/g,
                        " ",
                      )}
                    </span>

                    <span className="font-medium text-[#3f2d2a]">
                      {status.count}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 bg-[#e6ddd4]">
                    <div
                      className="h-full bg-[#7a5650]"
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