import type { RevenuePoint } from "@/types/dashboard";

const money = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

export function RevenueCard({
  revenue,
  loading,
}: {
  revenue: RevenuePoint[];
  loading?: boolean;
}) {
  const max = Math.max(...revenue.map((item) => item.revenue), 1);
  const total = revenue.reduce((sum, item) => sum + item.revenue, 0);
  const best = revenue.reduce<RevenuePoint | null>(
    (top, item) => (!top || item.revenue > top.revenue ? item : top),
    null,
  );

  return (
    <section className="min-w-0 border border-[#e6ddd4] bg-[#fbf9f5] p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[#958781]">
            Revenue
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[#3f2d2a]">
            Sales overview
          </h2>
        </div>

        {!loading && revenue.length > 0 ? (
          <dl className="flex gap-6 text-right">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.14em] text-[#958781]">
                Period total
              </dt>
              <dd className="font-serif text-xl text-[#3f2d2a]">
                {money(total)}
              </dd>
            </div>

            {best ? (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.14em] text-[#958781]">
                  Best day
                </dt>
                <dd className="font-serif text-xl text-[#7a5650]">
                  {money(best.revenue)}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </div>

      <div className="mt-8 h-56">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-[#958781]">
            Loading revenue...
          </div>
        ) : revenue.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#958781]">
            No revenue data available.
          </div>
        ) : (
          <div className="flex h-full items-end gap-1 sm:gap-2">
            {revenue.map((item, index) => {
              const height = Math.max(6, (item.revenue / max) * 100);
              const isBest = best?.date === item.date;

              return (
                <div
                  key={item.date}
                  className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                >
                  <div
                    className={`w-full transition-colors ${
                      isBest
                        ? "bg-[#7a5650]"
                        : "bg-[#d2bea0] group-hover:bg-[#a98282]"
                    }`}
                    style={{ height: `${height}%` }}
                    title={`${item.label}: ${money(item.revenue)}`}
                  />

                  <p
                    className={`mt-2 truncate text-center text-[10px] text-[#958781] ${
                      index % 2 ? "hidden sm:block" : ""
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
