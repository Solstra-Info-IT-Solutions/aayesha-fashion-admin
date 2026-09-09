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
  void productId;

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

  const saveCreate =
    async (
      variant: ProductVariant,
    ) => {
      await onCreate(
        variant,
      );

      setModalOpen(false);
      setEditingVariant(null);
    };

  const saveUpdate =
    async (
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
    <section className="rounded-2xl border border-[#e7e2dd] bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#171717]">
            Variants & SKU
          </h2>

          <p className="mt-1 text-sm text-[#6f706f]">
            Manage color, size, price and
            SKU-level configuration.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingVariant(
              null,
            );
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#171717] px-3.5 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={15} />
          Add Variant
        </button>
      </div>

      <div className="mt-5">
        {variants.length ===
        0 ? (
          <div className="rounded-xl border border-dashed border-[#d8d1ca] px-4 py-10 text-center text-sm text-[#969696]">
            No variants added yet.
          </div>
        ) : (
          <VariantTable
            variants={
              variants
            }
            onEdit={(
              variant,
            ) => {
              setEditingVariant(
                variant,
              );
              setModalOpen(true);
            }}
            onDelete={(
              variant,
            ) => {
              void onDelete(
                variant.id,
              );
            }}
          />
        )}
      </div>

      <VariantFormModal
        open={modalOpen}
        productId={productId}
        variant={
          editingVariant
        }
        saving={saving}
        accessToken={
          accessToken
        }
        onClose={() => {
          setModalOpen(false);
          setEditingVariant(
            null,
          );
        }}
        onCreate={
          saveCreate
        }
        onUpdate={
          saveUpdate
        }
      />
    </section>
  );
}