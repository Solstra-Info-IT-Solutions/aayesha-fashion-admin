"use client";

import {
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useProductVariants } from "@/hooks/useProductVariants";

import type {
  ProductVariant,
  VariantStatus,
} from "@/types/product-variant";

import VariantsHeader from "./VariantsHeader";
import VariantsToolbar from "./VariantsToolbar";
import VariantsTable from "./VariantsTable";
import VariantsEmptyState from "./VariantsEmptyState";
import VariantFormModal from "./VariantFormModal";

interface ProductVariantsPageProps {
  productId: string;
}

export default function ProductVariantsPage({
  productId,
}: ProductVariantsPageProps) {
  const {
    accessToken,
  } = useAdminAuth();

  const {
    variants,
    loading,
    actionLoading,
    error,
    refresh,
    createVariant,
    updateVariant,
    removeVariant,
  } = useProductVariants(
    productId,
  );

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<
      "all" | VariantStatus
    >("all");

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    editingVariant,
    setEditingVariant,
  ] =
    useState<ProductVariant | null>(
      null,
    );

  const filteredVariants =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return variants.filter(
        (variant) => {
          const matchesSearch =
            !query ||
            variant.sku
              .toLowerCase()
              .includes(query) ||
            variant.color.name
              .toLowerCase()
              .includes(query) ||
            variant.size.label
              .toLowerCase()
              .includes(query) ||
            (
              variant.barcode ??
              ""
            )
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            status === "all" ||
            variant.status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      variants,
      search,
      status,
    ]);

  const openCreate = () => {
    setEditingVariant(null);
    setFormOpen(true);
  };

  const openEdit = (
    variant: ProductVariant,
  ) => {
    setEditingVariant(variant);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (actionLoading) {
      return;
    }

    setFormOpen(false);
    setEditingVariant(null);
  };

  const handleCreate = async (
    payload: Parameters<
      typeof createVariant
    >[0],
  ) => {
    try {
      await createVariant(
        payload,
      );

      toast.success(
        "Variant created successfully.",
      );

      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create variant.",
      );
    }
  };

  const handleUpdate = async (
    variantId: string,
    payload: Parameters<
      typeof updateVariant
    >[1],
  ) => {
    try {
      await updateVariant(
        variantId,
        payload,
      );

      toast.success(
        "Variant updated successfully.",
      );

      closeForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update variant.",
      );
    }
  };

  const handleDelete = async (
    variant: ProductVariant,
  ) => {
    const confirmed =
      window.confirm(
        `Delete variant "${variant.sku}"? This action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      await removeVariant(
        variant.id,
      );

      toast.success(
        "Variant deleted successfully.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete variant.",
      );
    }
  };

  if (!accessToken) {
    return null;
  }

  return (
    <div className="space-y-6">
      <VariantsHeader
        onAdd={openCreate}
        onRefresh={() =>
          void refresh()
        }
        loading={loading}
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <VariantsToolbar
        search={search}
        status={status}
        onSearchChange={
          setSearch
        }
        onStatusChange={(value) =>
          setStatus(
            value as
              | "all"
              | VariantStatus,
          )
        }
      />

      {loading ||
      filteredVariants.length >
        0 ? (
        <VariantsTable
          variants={
            filteredVariants
          }
          loading={loading}
          onEdit={openEdit}
          onDelete={
            handleDelete
          }
        />
      ) : (
        <VariantsEmptyState
          filtered={
            search.trim() !==
              "" ||
            status !== "all"
          }
          onAdd={openCreate}
        />
      )}

      <VariantFormModal
        open={formOpen}
        productId={productId}
        variant={editingVariant}
        saving={actionLoading}
        accessToken={
          accessToken
        }
        onClose={closeForm}
        onCreate={handleCreate}
        onUpdate={
          handleUpdate
        }
      />
    </div>
  );
}