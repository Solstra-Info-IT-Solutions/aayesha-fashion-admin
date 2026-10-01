"use client";

import Link from "next/link";
import { Plus, RefreshCw, Upload } from "lucide-react";

export default function ProductHeader({
  loading,
  total,
  onRefresh,
}: {
  loading: boolean;
  total: number;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6a3b]">Catalog</p>

        <h1 className="mt-1 text-[#2a2520]">Products</h1>

        <p className="mt-2 text-sm text-[#5f584d]">
          Manage pricing, stock and publishing. Import many products at once from a CSV.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#e6dfcf] bg-[#fffdf8] px-3.5 py-1.5 text-sm text-[#5f584d]">
          <strong className="font-semibold text-[#2a2520]">{total.toLocaleString("en-IN")}</strong>{" "}
          {total === 1 ? "product" : "products"}
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-4 text-sm font-semibold text-[#2a2520] transition hover:border-[#b08d57] disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>

        <Link
          href="/admin/products/import"
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-4 text-sm font-semibold text-[#2a2520] transition hover:border-[#b08d57]"
        >
          <Upload size={15} />
          Import CSV
        </Link>

        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-[#26221d] px-4 text-sm font-semibold text-[#fffdf8] transition hover:bg-[#3d372f]"
        >
          <Plus size={16} />
          Add product
        </Link>
      </div>
    </div>
  );
}
