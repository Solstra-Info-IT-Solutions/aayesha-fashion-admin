"use client";

import { useEffect, useState } from "react";

import { getCategories } from "@/services/catalog.service";
import { useAdminAuth } from "@/hooks/useAdminAuth";

import type { Category } from "@/types/catalog";

interface ProductBasicSectionProps {
  name: string;
  categoryId: string;
  onChange: (values: {
    name?: string;
    categoryId?: string;
  }) => void;
}

const inputClassName =
  "box-border h-11 min-w-0 w-full max-w-full rounded-xl border border-[#d8cec5] bg-[#fbf9f5] px-3 text-sm text-[#3f2d2a] outline-none transition focus:border-[#a98282] focus:ring-2 focus:ring-[#e9dcd7]";

const selectClassName =
  "box-border h-11 min-w-0 w-full max-w-full rounded-xl border border-[#d8cec5] bg-[#fbf9f5] px-3 text-sm text-[#3f2d2a] outline-none transition focus:border-[#a98282] focus:ring-2 focus:ring-[#e9dcd7] disabled:cursor-not-allowed disabled:bg-[#f7f3ed] disabled:text-[#958781]";

const labelClassName =
  "mb-1.5 block break-words text-sm font-medium leading-5 text-[#3f2d2a]";

export default function ProductBasicSection({
  name,
  categoryId,
  onChange,
}: ProductBasicSectionProps) {
  const { accessToken } = useAdminAuth();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [categoryError, setCategoryError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setLoadingCategories(false);
      return;
    }

    let cancelled = false;

    const loadCategories = async () => {
      setLoadingCategories(true);
      setCategoryError(null);

      try {
        const response = await getCategories(
          accessToken,
          {
            page: 1,
            limit: 100,
            isActive: "true",
            sort: "sort_order",
          },
        );

        if (cancelled) {
          return;
        }

        setCategories(response.items);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setCategoryError(
          error instanceof Error
            ? error.message
            : "Unable to load categories.",
        );
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    };

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e6ddd4] bg-[#fbf9f5] p-4 sm:p-5">
      {/* HEADER */}
      <div className="min-w-0">
        <h2 className="break-words text-base font-semibold leading-6 text-[#3f2d2a]">
          Product Basics
        </h2>

        <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#70635d]">
          Add the basic information for this product.
        </p>
      </div>

      {/* FORM */}
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        {/* PRODUCT NAME */}
        <label className="block min-w-0 md:col-span-2">
          <span className={labelClassName}>
            Product Name
          </span>

          <input
            value={name}
            onChange={(event) =>
              onChange({
                name: event.target.value,
              })
            }
            placeholder="Readymade Cotton Suit"
            className={inputClassName}
          />
        </label>

        {/* CATEGORY */}
        <label className="block min-w-0 md:col-span-2">
          <span className={labelClassName}>
            Product Category
          </span>

          <select
            value={categoryId}
            onChange={(event) =>
              onChange({
                categoryId: event.target.value,
              })
            }
            disabled={loadingCategories}
            className={selectClassName}
          >
            <option value="">
              {loadingCategories
                ? "Loading categories..."
                : "Select Product Category"}
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {categoryError && (
            <p className="mt-1.5 break-words text-xs leading-5 text-[#955c56]">
              {categoryError}
            </p>
          )}

          {!loadingCategories &&
            !categoryError &&
            categories.length === 0 && (
              <p className="mt-1.5 break-words text-xs leading-5 text-[#958781]">
                No active categories available. Create a
                category first.
              </p>
            )}
        </label>
      </div>
    </section>
  );
}