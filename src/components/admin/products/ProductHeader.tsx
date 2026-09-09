"use client";

import Link from "next/link";

import {
  Plus,
  RefreshCw,
} from "lucide-react";

interface ProductHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export default function ProductHeader({
  loading,
  onRefresh,
}: ProductHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#e7e2dd] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#969696]">
          Catalog
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#171717]">
          Products
        </h1>

        <p className="mt-1 text-sm text-[#6f706f]">
          Manage products, content,
          pricing, variants and publishing.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d8d1ca] px-3.5 text-sm font-medium text-[#292c2c] hover:bg-[#fcfbf9] disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />
          Refresh
        </button>

        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-medium text-white hover:bg-[#292c2c]"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>
    </div>
  );
}