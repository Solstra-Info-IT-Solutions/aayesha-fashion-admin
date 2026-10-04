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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c7a3]">Catalog</p>

        <h1 className="mt-1 text-[#f8f3f1]">Products</h1>

        <p className="mt-2 text-sm text-[#cfc7bb]">
          Manage pricing, stock and publishing. Import many products at once from a CSV.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[#2e2a26] bg-[#1a1816] px-3.5 py-1.5 text-sm text-[#cfc7bb]">
          <strong className="font-semibold text-[#f8f3f1]">{total.toLocaleString("en-IN")}</strong>{" "}
          {total === 1 ? "product" : "products"}
        </span>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] transition hover:border-[#b79a6a] disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>

        <Link
          href="/admin/products/import"
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-[#3a352f] bg-[#1a1816] px-4 text-sm font-semibold text-[#f8f3f1] transition hover:border-[#b79a6a]"
        >
          <Upload size={15} />
          Import CSV
        </Link>

        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg bg-[#b79a6a] px-4 text-sm font-semibold text-[#1a1816] transition hover:bg-[#c8ad7f]"
        >
          <Plus size={16} />
          Add product
        </Link>
      </div>
    </div>
  );
}
