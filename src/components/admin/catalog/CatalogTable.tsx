"use client";

import {
  Loader2,
  Pencil,
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
          : "bg-neutral-100 text-neutral-500",
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
        <td className="px-5 py-4 text-sm text-neutral-600">
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
        <td className="px-5 py-4 text-sm text-neutral-600">
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
        <td className="px-5 py-4 text-sm capitalize text-neutral-600">
          {badge.tone}
        </td>
      );
    }

    case "attributes": {
      const attribute =
        item as AttributeMaster;

      return (
        <td className="px-5 py-4 text-sm text-neutral-600">
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
              className="h-6 w-6 rounded-full border border-neutral-200"
              style={{
                backgroundColor:
                  color.hex ??
                  "#ffffff",
              }}
            />

            <span className="text-sm text-neutral-600">
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
}: Props) {
  const columnCount =
    getColumnCount(resource);

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-neutral-200 bg-neutral-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Name
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Identifier
              </th>

              {resource !== "tags" &&
                resource !==
                  "sizes" && (
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
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

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-5 py-16 text-center"
                >
                  <span className="inline-flex items-center gap-2 text-sm text-neutral-500">
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
                      item._id
                    }
                    className="transition hover:bg-neutral-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-neutral-900">
                        {getName(
                          item,
                        )}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-neutral-500">
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
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(
                            item,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
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