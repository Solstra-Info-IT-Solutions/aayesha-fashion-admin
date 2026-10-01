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
    <div className="flex flex-col gap-4 border-b border-[#e6ddd4] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#958781]">
          Catalog
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#3f2d2a]">
          Products
        </h1>

        <p className="mt-1 text-sm text-[#70635d]">
          Manage products, content,
          pricing and publishing.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d8cec5] px-3.5 text-sm font-medium text-[#3f2d2a] hover:bg-[#f7f3ed] disabled:opacity-50"
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
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#7a5650] px-4 text-sm font-medium text-white hover:bg-[#543c38]"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>
    </div>
  );
}