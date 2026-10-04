"use client";

import Link from "next/link";

import {
  BadgeCheck,
  ChevronRight,
  FolderTree,
  Layers3,
  Palette,
  Ruler,
  Tags,
  TextCursorInput,
} from "lucide-react";

const items = [
  {
    title: "Categories",
    description:
      "Manage primary and nested product categories.",
    href: "/admin/catalog/categories",
    icon: FolderTree,
  },
  {
    title: "Collections",
    description:
      "Manage curated and featured product collections.",
    href: "/admin/catalog/collections",
    icon: Layers3,
  },
  {
    title: "Tags",
    description:
      "Manage reusable product discovery tags.",
    href: "/admin/catalog/tags",
    icon: Tags,
  },
  {
    title: "Badges",
    description:
      "Manage product labels and promotional badges.",
    href: "/admin/catalog/badges",
    icon: BadgeCheck,
  },
  {
    title: "Attributes",
    description:
      "Define reusable product attributes and value types.",
    href: "/admin/catalog/attributes",
    icon: TextCursorInput,
  },
  {
    title: "Sizes",
    description:
      "Manage standard product size codes and labels.",
    href: "/admin/catalog/sizes",
    icon: Ruler,
  },
  {
    title: "Colors",
    description:
      "Manage product colors, slugs and swatches.",
    href: "/admin/catalog/colors",
    icon: Palette,
  },
];

export default function CatalogPage() {
  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9c7a3]">
          Catalog
        </p>

        <h1 className="mt-1 text-[#f8f3f1]">
          Catalog Management
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9a9185]">
          Manage the master data that powers
          products, merchandising and
          storefront discovery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group surface surface-hover p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#2a241b] text-[#d9c7a3]">
                  <Icon className="h-5 w-5" />
                </div>

                <ChevronRight className="h-5 w-5 text-[#8c847d] transition group-hover:translate-x-0.5 group-hover:text-[#9a9185]" />
              </div>

              <h2 className="display mt-5 text-2xl font-semibold text-[#f8f3f1]">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#9a9185]">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}