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

const badges =
  [
    "new",
    "best-seller",
    "featured",
    "exclusive",
    "limited",
    "sale",
    "trending",
    "back-in-stock",
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
            (item) =>
              item !== badge,
          )
        : [
            ...merchandising.badges,
            badge,
          ],
    });
  };

  return (
    <section className="rounded-2xl border border-[#e7e2dd] bg-white p-5">
      <h2 className="text-base font-semibold text-[#171717]">
        Merchandising
      </h2>

      <p className="mt-1 text-sm text-[#6f706f]">
        Storefront visibility and commercial
        positioning.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["isNew", "New"],
          [
            "isFeatured",
            "Featured",
          ],
          [
            "isBestSeller",
            "Best Seller",
          ],
        ].map(
          ([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-3 rounded-xl border border-[#e7e2dd] px-4 py-3"
            >
              <input
                type="checkbox"
                checked={
                  Boolean(
                    merchandising[
                      key as keyof ProductMerchandising
                    ],
                  )
                }
                onChange={(event) =>
                  onChange({
                    ...merchandising,
                    [key]:
                      event.target
                        .checked,
                  })
                }
                className="h-4 w-4 accent-[#171717]"
              />

              <span className="text-sm font-medium text-[#292c2c]">
                {label}
              </span>
            </label>
          ),
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-[#292c2c]">
          Badges
        </p>

        <div className="flex flex-wrap gap-2">
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
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${
                    selected
                      ? "border-[#171717] bg-[#171717] text-white"
                      : "border-[#d8d1ca] text-[#6f706f]"
                  }`}
                >
                  {badge.replace(
                    "-",
                    " ",
                  )}
                </button>
              );
            },
          )}
        </div>
      </div>

      <div className="mt-5 max-w-xs">
        <label>
          <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
            Ranking
          </span>

          <input
            type="number"
            min={0}
            value={
              merchandising.ranking ??
              ""
            }
            onChange={(event) =>
              onChange({
                ...merchandising,
                ranking:
                  event.target
                    .value === ""
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
            className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791]"
          />
        </label>
      </div>
    </section>
  );
}