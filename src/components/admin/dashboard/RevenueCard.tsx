import type {
  RevenuePoint,
} from "@/types/dashboard";

export function RevenueCard({
  revenue,
  loading,
}: {
  revenue: RevenuePoint[];
  loading?: boolean;
}) {
  const max = Math.max(
    ...revenue.map(
      (item) => item.revenue,
    ),
    1,
  );

  return (
    <section className="border border-[#e7e2dd] bg-white p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[#969696]">
            Revenue
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[#171717]">
            Sales overview
          </h2>
        </div>
      </div>

      <div className="mt-8 h-56">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-[#969696]">
            Loading revenue...
          </div>
        ) : revenue.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#969696]">
            No revenue data available.
          </div>
        ) : (
          <div className="flex h-full items-end gap-2">
            {revenue.map(
              (item) => {
                const height =
                  Math.max(
                    8,
                    (item.revenue /
                      max) *
                      100,
                  );

                return (
                  <div
                    key={item.date}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >
                    <div
                      className="relative bg-[#292c2c]"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${item.label}: ₹${item.revenue.toLocaleString("en-IN")}`}
                    />

                    <p className="mt-2 truncate text-center text-[10px] text-[#969696]">
                      {item.label}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </section>
  );
}