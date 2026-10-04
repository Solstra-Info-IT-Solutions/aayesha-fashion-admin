"use client";

import {
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  CatalogItem,
  CatalogResource,
} from "@/hooks/useCatalog";

import type {
  AttributeMaster,
  Badge,
  Category,
  Collection,
  ColorMaster,
} from "@/types/catalog";

type Props = {
  resource: CatalogResource;
  items: CatalogItem[];
  loading: boolean;
  onEdit: (
    item: CatalogItem,
  ) => void;
  onDelete: (
    item: CatalogItem
    ) => void;
};

function getName(
  item: CatalogItem,
): string {
  if (
    "name" in item &&
    typeof item.name === "string"
  ) {
    return item.name;
  }

  if (
    "label" in item &&
    typeof item.label === "string"
  ) {
    return item.label;
  }

  if (
    "code" in item &&
    typeof item.code === "string"
  ) {
    return item.code;
  }

  return "—";
}

function getIdentifier(
  item: CatalogItem,
): string {
  if (
    "slug" in item &&
    typeof item.slug === "string"
  ) {
    return item.slug;
  }

  if (
    "key" in item &&
    typeof item.key === "string"
  ) {
    return item.key;
  }

  return "—";
}

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-[#211e1b] text-[#9a9185]",
      ].join(" ")}
    >
      {active
        ? "Active"
        : "Inactive"}
    </span>
  );
}

function renderExtraCell(
  resource: CatalogResource,
  item: CatalogItem,
) {
  switch (resource) {
    case "categories": {
      return (
        <td className="px-5 py-4 text-sm text-[#cfc7bb]">
          {(item as Category).parentId
            ? "Nested"
            : "Root"}
        </td>
      );
    }

    case "collections": {
      const collection =
        item as Collection;

      return (
        <td className="px-5 py-4 text-sm text-[#cfc7bb]">
          {collection.isFeatured
            ? "Yes"
            : "No"}
        </td>
      );
    }

    case "badges": {
      const badge =
        item as Badge;

      return (
        <td className="px-5 py-4 text-sm capitalize text-[#cfc7bb]">
          {badge.tone}
        </td>
      );
    }

    case "attributes": {
      const attribute =
        item as AttributeMaster;

      return (
        <td className="px-5 py-4 text-sm text-[#cfc7bb]">
          {attribute.type}
        </td>
      );
    }

    case "colors": {
      const color =
        item as ColorMaster;

      return (
        <td className="px-5 py-4">
          <div className="flex items-center gap-2">
            <span
              className="h-6 w-6 rounded-full border border-[#3a352f]"
              style={{
                backgroundColor:
                  color.hex ??
                  "#1a1816",
              }}
            />

            <span className="text-sm text-[#cfc7bb]">
              {color.hex ??
                "—"}
            </span>
          </div>
        </td>
      );
    }

    case "tags":
    case "sizes":
      return null;

    default:
      return null;
  }
}

function getColumnCount(
  resource: CatalogResource,
) {
  return [
    "categories",
    "collections",
    "badges",
    "attributes",
    "colors",
  ].includes(resource)
    ? 5
    : 4;
}

export default function CatalogTable({
  resource,
  items,
  loading,
  onEdit,
  onDelete
}: Props) {
  const columnCount =
    getColumnCount(resource);

  const cards = !loading && (
    <div className="divide-y divide-[#2e2a26] md:hidden">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#f8f3f1]">{getName(item)}</p>
            <p className="truncate text-xs text-[#9a9185]">{getIdentifier(item)}</p>
            <div className="mt-2"><StatusBadge active={item.isActive} /></div>
          </div>
          <div className="flex shrink-0 gap-1">
            <button type="button" aria-label="Edit" onClick={() => onEdit(item)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#3a352f] text-[#e6dfd4] hover:bg-[#2a241b]">
              <Pencil className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Delete" onClick={() => onDelete(item)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#5a2a27] text-[#e08b84] hover:bg-[#2b1a18]">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden">
      {cards}
      <div className={loading ? "overflow-x-auto" : "hidden overflow-x-auto md:block"}>
        <table className="min-w-full">
          <thead className="border-b border-[#3a352f] bg-[#111111]">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#9a9185]">
                Name
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#9a9185]">
                Identifier
              </th>

              {resource !== "tags" &&
                resource !==
                  "sizes" && (
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#9a9185]">
                    {resource ===
                    "categories"
                      ? "Hierarchy"
                      : resource ===
                          "collections"
                        ? "Featured"
                        : resource ===
                            "badges"
                          ? "Tone"
                          : resource ===
                              "attributes"
                            ? "Type"
                            : "Color"}
                  </th>
                )}

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#9a9185]">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#9a9185]">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#2e2a26]">
            {loading ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-5 py-16 text-center"
                >
                  <span className="inline-flex items-center gap-2 text-sm text-[#9a9185]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                </td>
              </tr>
            ) : (
              items.map(
                (item) => (
                  <tr
                    key={
                      item.id
                    }
                    className="transition hover:bg-[#111111]"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#f8f3f1]">
                        {getName(
                          item,
                        )}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#9a9185]">
                      {getIdentifier(
                        item,
                      )}
                    </td>

                    {renderExtraCell(
                      resource,
                      item,
                    )}

                    <td className="px-5 py-4">
                      <StatusBadge
                        active={
                          item.isActive
                        }
                      />
                    </td>

                    <td className="px-5 py-4 text-right">
  <div className="inline-flex items-center gap-1">
    <button
      type="button"
      onClick={() =>
        onEdit(item)
      }
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#e6dfd4] transition hover:bg-[#211e1b] hover:text-[#f8f3f1]"
    >
      <Pencil className="h-3.5 w-3.5" />
      Edit
    </button>

    <button
      type="button"
      onClick={() =>
        onDelete(item)
      }
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#e08b84] transition hover:bg-[#2b1a18] hover:text-[#f0a39d]"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Delete
    </button>
  </div>
</td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}