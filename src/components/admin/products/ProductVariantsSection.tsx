"use client";

import {
  useState,
} from "react";

import { Plus } from "lucide-react";

import type {
  ProductVariant,
} from "@/types/product";

import VariantTable from "./variants/VariantTable";
import VariantFormModal from "./variants/VariantFormModal";

interface ProductVariantsSectionProps {
  productId: string;
  variants: ProductVariant[];
  accessToken: string | null;
  saving?: boolean;
  onCreate: (
    variant: ProductVariant,
  ) => Promise<void>;
  onUpdate: (
    variantId: string,
    variant: Partial<ProductVariant>,
  ) => Promise<void>;
  onDelete: (
    variantId: string,
  ) => Promise<void>;
}

export default function ProductVariantsSection({
  productId,
  variants,
  accessToken,
  saving = false,
  onCreate,
  onUpdate,
  onDelete,
}: ProductVariantsSectionProps) {
  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingVariant,
    setEditingVariant,
  ] =
    useState<ProductVariant | null>(
      null,
    );

  const saveCreate = async (
    variant: ProductVariant,
  ) => {
    await onCreate(variant);

    setModalOpen(false);
    setEditingVariant(null);
  };

  const saveUpdate = async (
    variantId: string,
    variant: Partial<ProductVariant>,
  ) => {
    await onUpdate(
      variantId,
      variant,
    );

    setModalOpen(false);
    setEditingVariant(null);
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e7e2dd] bg-white p-4 sm:p-5">
      {/* HEADER */}
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold leading-6 text-[#171717]">
            Variants & SKU
          </h2>

          <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#6f706f]">
            Manage color, size, price and
            SKU-level configuration.
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => {
            setEditingVariant(null);
            setModalOpen(true);
          }}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={15} />
          Add Variant
        </button>
      </div>

      {/* VARIANT TABLE / EMPTY STATE */}
      <div className="mt-6 min-w-0">
        {variants.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d8d1ca] bg-[#fcfbf9] px-5 py-12 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f1ec]">
              <Plus
                size={18}
                className="text-[#969696]"
              />
            </div>

            <p className="mt-3 break-words text-sm font-medium text-[#292c2c]">
              No variants added yet
            </p>

            <p className="mx-auto mt-1.5 max-w-md break-words text-xs leading-5 text-[#969696]">
              Add color, size, pricing and SKU
              information for this product.
            </p>
          </div>
        ) : (
          <div className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-[#e7e2dd]">
            <VariantTable
              variants={variants}
              onEdit={(variant) => {
                setEditingVariant(
                  variant,
                );
                setModalOpen(true);
              }}
              onDelete={(variant) => {
                void onDelete(
                  variant.id,
                );
              }}
            />
          </div>
        )}
      </div>

      {/* VARIANT MODAL */}
      <VariantFormModal
        open={modalOpen}
        productId={productId}
        variant={editingVariant}
        saving={saving}
        accessToken={accessToken}
        onClose={() => {
          setModalOpen(false);
          setEditingVariant(null);
        }}
        onCreate={saveCreate}
        onUpdate={saveUpdate}
      />
    </section>
  );
}