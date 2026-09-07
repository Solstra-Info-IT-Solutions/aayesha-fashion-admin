import type {
  TopProduct,
} from "@/types/dashboard";

export function TopProducts({
  products,
  loading,
}: {
  products: TopProduct[];
  loading: boolean;
}) {
  return (
    <section className="border border-[#e7e2dd] bg-white p-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#969696]">
          Performance
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#171717]">
          Top products
        </h2>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <p className="text-sm text-[#969696]">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="text-sm text-[#969696]">
            No product performance data.
          </p>
        ) : (
          products.map(
            (product) => (
              <article
                key={product.id}
                className="border border-[#eee9e4] p-4"
              >
                <p className="line-clamp-2 min-h-10 text-sm font-medium text-[#171717]">
                  {product.name}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[#969696]">
                      Units
                    </p>

                    <p className="mt-1 text-lg font-medium text-[#171717]">
                      {product.unitsSold}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[#969696]">
                      Revenue
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#171717]">
                      ₹
                      {product.revenue.toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>
              </article>
            ),
          )
        )}
      </div>
    </section>
  );
}