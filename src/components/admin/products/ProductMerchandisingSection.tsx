"use client";

import type {
  ProductMerchandising,
} from "@/types/admin-product";

interface ProductMerchandisingSectionProps {
  merchandising: ProductMerchandising;
  onChange: (
    merchandising: ProductMerchandising,
  ) => void;
}

const badges = [
  "new",
  "best-seller",
  "featured",
  "exclusive",
  "limited",
  "sale",
  "trending",
  "back-in-stock",
] as const;

const checkboxItems = [
  ["isNew", "New"],
  ["isFeatured", "Featured"],
  ["isBestSeller", "Best Seller"],
] as const;

export default function ProductMerchandisingSection({
  merchandising,
  onChange,
}: ProductMerchandisingSectionProps) {
  const toggleBadge = (
    badge: (typeof badges)[number],
  ) => {
    const exists =
      merchandising.badges.includes(
        badge,
      );

    onChange({
      ...merchandising,
      badges: exists
        ? merchandising.badges.filter(
            (item) => item !== badge,
          )
        : [
            ...merchandising.badges,
            badge,
          ],
    });
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e5e7ec] bg-[#ffffff] p-4 sm:p-5">
      {/* HEADER */}
      <div className="min-w-0">
        <h2 className="break-words text-base font-semibold leading-6 text-[#0f172a]">
          Merchandising
        </h2>

        <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#5b6270]">
          Storefront visibility and commercial
          positioning.
        </p>
      </div>

      {/* VISIBILITY OPTIONS */}
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-3">
        {checkboxItems.map(
          ([key, label]) => (
            <label
              key={key}
              className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#e5e7ec] bg-[#ffffff] px-3 py-2.5 transition hover:bg-[#f6f7fb]"
            >
              <input
                type="checkbox"
                checked={Boolean(
                  merchandising[
                    key as keyof ProductMerchandising
                  ],
                )}
                onChange={(event) =>
                  onChange({
                    ...merchandising,
                    [key]:
                      event.target.checked,
                  })
                }
                className="h-4 w-4 shrink-0 accent-[#0f172a]"
              />

              <span className="min-w-0 break-words text-xs font-medium leading-5 text-[#0f172a]">
                {label}
              </span>
            </label>
          ),
        )}
      </div>

      {/* BADGES */}
      <div className="mt-5 min-w-0">
        <p className="mb-2 text-xs font-medium leading-5 text-[#0f172a]">
          Badges
        </p>

        <div className="flex min-w-0 max-w-full flex-wrap gap-1.5">
          {badges.map(
            (badge) => {
              const selected =
                merchandising.badges.includes(
                  badge,
                );

              return (
                <button
                  key={badge}
                  type="button"
                  onClick={() =>
                    toggleBadge(
                      badge,
                    )
                  }
                  className={`inline-flex max-w-full items-center justify-center rounded-full border px-2.5 py-1.5 text-[11px] font-medium capitalize leading-4 transition ${
                    selected
                      ? "border-[#4338ca] bg-[#4338ca] text-white"
                      : "border-[#d3d7df] bg-[#ffffff] text-[#5b6270] hover:bg-[#f6f7fb]"
                  }`}
                >
                  <span className="break-words">
                    {badge.replace(
                      "-",
                      " ",
                    )}
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* RANKING */}
      <div className="mt-5 min-w-0 max-w-xs">
        <label className="block min-w-0">
          <span className="mb-1.5 block break-words text-xs font-medium leading-5 text-[#0f172a]">
            Ranking
          </span>

          <input
            type="number"
            min={0}
            value={
              merchandising.ranking ?? ""
            }
            onChange={(event) =>
              onChange({
                ...merchandising,
                ranking:
                  event.target.value ===
                  ""
                    ? undefined
                    : Math.max(
                        0,
                        Number(
                          event.target
                            .value,
                        ) || 0,
                      ),
              })
            }
            className="box-border h-10 min-w-0 w-full max-w-full rounded-xl border border-[#d3d7df] bg-[#ffffff] px-3 text-sm text-[#0f172a] outline-none transition focus:border-[#818cf8] focus:ring-2 focus:ring-[#eef2ff]"
          />
        </label>
      </div>
    </section>
  );
}