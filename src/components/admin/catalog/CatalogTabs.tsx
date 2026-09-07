"use client";

import Link from "next/link";

import {
  BadgeCheck,
  FolderTree,
  Layers3,
  Palette,
  Ruler,
  Tags,
  TextCursorInput,
} from "lucide-react";

type Props = {
  active?: string;
};

const tabs = [
  {
    key: "categories",
    label: "Categories",
    href: "/admin/catalog/categories",
    icon: FolderTree,
  },
  {
    key: "collections",
    label: "Collections",
    href: "/admin/catalog/collections",
    icon: Layers3,
  },
  {
    key: "tags",
    label: "Tags",
    href: "/admin/catalog/tags",
    icon: Tags,
  },
  {
    key: "badges",
    label: "Badges",
    href: "/admin/catalog/badges",
    icon: BadgeCheck,
  },
  {
    key: "attributes",
    label: "Attributes",
    href: "/admin/catalog/attributes",
    icon: TextCursorInput,
  },
  {
    key: "sizes",
    label: "Sizes",
    href: "/admin/catalog/sizes",
    icon: Ruler,
  },
  {
    key: "colors",
    label: "Colors",
    href: "/admin/catalog/colors",
    icon: Palette,
  },
];

export default function CatalogTabs({
  active,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-1 rounded-xl border border-neutral-200 bg-white p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          const isActive =
            active === tab.key;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={[
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}