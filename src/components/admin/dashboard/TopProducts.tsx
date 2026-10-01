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
    <section className="border border-[#e6ddd4] bg-[#fbf9f5] p-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#958781]">
          Performance
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#3f2d2a]">
          Top products
        </h2>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <p className="text-sm text-[#958781]">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="text-sm text-[#958781]">
            No product performance data.
          </p>
        ) : (
          products.map(
            (product) => (
              <article
                key={product.id}
                className="border border-[#e6ddd4] p-4"
              >
                <p className="line-clamp-2 min-h-10 text-sm font-medium text-[#3f2d2a]">
                  {product.name}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[#958781]">
                      Units
                    </p>

                    <p className="mt-1 text-lg font-medium text-[#3f2d2a]">
                      {product.unitsSold}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[#958781]">
                      Revenue
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#3f2d2a]">
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