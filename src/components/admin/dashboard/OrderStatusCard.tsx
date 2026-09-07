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
    <section className="border border-[#e7e2dd] bg-white p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-[#969696]">
        Orders
      </p>

      <h2 className="mt-1 font-serif text-2xl text-[#171717]">
        Order status
      </h2>

      <div className="mt-7 space-y-4">
        {loading ? (
          <p className="text-sm text-[#969696]">
            Loading...
          </p>
        ) : statuses.length === 0 ? (
          <p className="text-sm text-[#969696]">
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
                    <span className="capitalize text-[#6f706f]">
                      {status.status.replace(
                        /_/g,
                        " ",
                      )}
                    </span>

                    <span className="font-medium text-[#171717]">
                      {status.count}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 bg-[#f0ece8]">
                    <div
                      className="h-full bg-[#292c2c]"
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