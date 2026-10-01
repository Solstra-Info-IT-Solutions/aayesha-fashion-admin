import Link from "next/link";

export default function ProductEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#d6ccb6] bg-[#fffdf8] px-6 py-14 text-center">
      <h3 className="text-base font-semibold text-[#2a2520]">
        No products found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5f584d]">
        Create your first product or
        change the current filters.
      </p>

      <Link
        href="/admin/products/new"
        className="mt-5 inline-flex rounded-xl bg-[#26221d] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3d372f]"
      >
        Add Product
      </Link>
    </div>
  );
}