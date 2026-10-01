"use client";

import Link from "next/link";

import {
  Plus,
  RefreshCw,
  Upload,
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
    <div className="flex flex-col gap-4 border-b border-[#e6dfcf] pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#756d62]">
          Catalog
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#2a2520]">
          Products
        </h1>

        <p className="mt-1 text-sm text-[#5f584d]">
          Manage products, content,
          pricing and publishing.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-xl border border-[#d6ccb6] px-3.5 text-sm font-medium text-[#2a2520] hover:bg-[#f7f2e7] disabled:opacity-50"
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
          href="/admin/products/import"
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-xl border border-[#d6ccb6] bg-white px-3.5 text-sm font-medium text-[#2a2520] hover:border-[#b08d57] hover:bg-[#f1ead9]"
        >
          <Upload size={16} />
          Import CSV
        </Link>

        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-xl bg-[#26221d] px-4 text-sm font-medium text-white hover:bg-[#3d372f]"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>
    </div>
  );
}