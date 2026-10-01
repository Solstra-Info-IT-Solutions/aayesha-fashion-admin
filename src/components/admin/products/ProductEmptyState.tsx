import Link from "next/link";

export default function ProductEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#d8cec5] bg-[#fbf9f5] px-6 py-14 text-center">
      <h3 className="text-base font-semibold text-[#3f2d2a]">
        No products found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#70635d]">
        Create your first product or
        change the current filters.
      </p>

      <Link
        href="/admin/products/new"
        className="mt-5 inline-flex rounded-xl bg-[#7a5650] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#543c38]"
      >
        Add Product
      </Link>
    </div>
  );
}