"use client";

import {
  useEffect,
  useState,
} from "react";

import { X } from "lucide-react";
import toast from "react-hot-toast";

import {
  getColors,
  getSizes,
} from "@/services/catalog.service";

import type {
  ColorMaster,
  SizeMaster,
} from "@/types/catalog";

import type {
  CreateProductVariantInput,
  ProductVariant,
  ProductColor,
  ProductSize,
  ProductPricing,
  UpdateProductVariantInput,
  VariantStatus,
} from "@/types/product-variant";

interface VariantFormModalProps {
  open: boolean;
  productId: string;
  variant: ProductVariant | null;
  saving?: boolean;
  accessToken: string | null;

  onClose: () => void;

  onCreate: (
    payload: CreateProductVariantInput,
  ) => Promise<void>;

  onUpdate: (
    variantId: string,
    payload: UpdateProductVariantInput,
  ) => Promise<void>;
}

/*
 * Catalog master types do not require `id` at the
 * TypeScript level in the existing admin catalog model.
 *
 * The API can nevertheless return Mongo's `_id`.
 */
type ColorMasterWithId =
  ColorMaster & {
    _id?: string;
  };

type SizeMasterWithId =
  SizeMaster & {
    _id?: string;
  };

function createVariantId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `variant-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function getColorId(
  color: ColorMasterWithId,
): string {
  return (
    color._id?.toString() ||
    color.slug
  );
}

export default function VariantFormModal({
  open,
  productId,
  variant,
  saving = false,
  accessToken,
  onClose,
  onCreate,
  onUpdate,
}: VariantFormModalProps) {
  const isEdit = Boolean(variant);

  const [
    colors,
    setColors,
  ] = useState<ColorMasterWithId[]>(
    [],
  );

  const [
    sizes,
    setSizes,
  ] = useState<SizeMasterWithId[]>(
    [],
  );

  const [
    mastersLoading,
    setMastersLoading,
  ] = useState(false);

  const [sku, setSku] =
    useState("");

  const [barcode, setBarcode] =
    useState("");

  const [colorId, setColorId] =
    useState("");

  const [sizeCode, setSizeCode] =
    useState("");

  const [mrp, setMrp] =
    useState("");

  const [
    sellingPrice,
    setSellingPrice,
  ] = useState("");

  const [
    compareAtPrice,
    setCompareAtPrice,
  ] = useState("");

  const [stock, setStock] =
    useState("0");

  const [reserved, setReserved] =
    useState("0");

  const [
    lowStockThreshold,
    setLowStockThreshold,
  ] = useState("0");

  const [weight, setWeight] =
    useState("");

  const [status, setStatus] =
    useState<VariantStatus>(
      "active",
    );

  /*
   * =======================================================
   * PREFILL FORM
   * =======================================================
   */

  useEffect(() => {
    if (!open) {
      return;
    }

    if (variant) {
      setSku(variant.sku);

      setBarcode(
        variant.barcode ?? "",
      );

      setColorId(
        variant.color.id,
      );

      setSizeCode(
        variant.size.code,
      );

      setMrp(
        String(
          variant.pricing.mrp,
        ),
      );

      setSellingPrice(
        String(
          variant.pricing
            .sellingPrice,
        ),
      );

      setCompareAtPrice(
        variant.pricing
          .compareAtPrice !==
          undefined
          ? String(
              variant.pricing
                .compareAtPrice,
            )
          : "",
      );

      setStock(
        String(
          variant.inventory
            .stock,
        ),
      );

      setReserved(
        String(
          variant.inventory
            .reserved,
        ),
      );

      setLowStockThreshold(
        String(
          variant.inventory
            .lowStockThreshold,
        ),
      );

      setWeight(
        variant.weight !==
          undefined
          ? String(
              variant.weight,
            )
          : "",
      );

      setStatus(
        variant.status,
      );
    } else {
      setSku("");
      setBarcode("");
      setColorId("");
      setSizeCode("");
      setMrp("");
      setSellingPrice("");
      setCompareAtPrice("");
      setStock("0");
      setReserved("0");
      setLowStockThreshold(
        "0",
      );
      setWeight("");
      setStatus("active");
    }
  }, [
    open,
    variant,
  ]);

  /*
   * =======================================================
   * LOAD CATALOG MASTERS
   * =======================================================
   */

  useEffect(() => {
    if (
      !open ||
      !accessToken
    ) {
      return;
    }

    const loadMasters =
      async () => {
        setMastersLoading(true);

        try {
          const params = {
            page: 1,
            limit: 100,
            isActive:
              "true" as const,
            sort:
              "sort_order" as const,
          };

          const [
            colorResponse,
            sizeResponse,
          ] = await Promise.all([
            getColors(
              accessToken,
              params,
            ),
            getSizes(
              accessToken,
              params,
            ),
          ]);

          setColors(
            colorResponse.items as ColorMasterWithId[],
          );

          setSizes(
            sizeResponse.items as SizeMasterWithId[],
          );
        } catch (error) {
          console.error(
            "Failed to load variant masters:",
            error,
          );

          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load colors and sizes.",
          );
        } finally {
          setMastersLoading(false);
        }
      };

    void loadMasters();
  }, [
    open,
    accessToken,
  ]);

  /*
   * =======================================================
   * SELECTED MASTER VALUES
   * =======================================================
   */

  const selectedColor =
    colors.find(
      (color) =>
        getColorId(color) ===
        colorId,
    );

  const selectedSize =
    sizes.find(
      (size) =>
        size.code ===
        sizeCode,
    );

  /*
   * =======================================================
   * SUBMIT
   * =======================================================
   */

  const submit = async () => {
    if (!accessToken) {
      toast.error(
        "Your admin session has expired. Please login again.",
      );
      return;
    }

    if (!sku.trim()) {
      toast.error(
        "SKU is required.",
      );
      return;
    }

    if (!selectedColor) {
      toast.error(
        "Please select a color.",
      );
      return;
    }

    if (!selectedSize) {
      toast.error(
        "Please select a size.",
      );
      return;
    }

    /*
     * -------------------------------------------------------
     * NUMERIC VALUES
     * -------------------------------------------------------
     */

    const mrpValue =
      Number(mrp);

    const sellingPriceValue =
      Number(
        sellingPrice,
      );

    const stockValue =
      Number(stock);

    const reservedValue =
      Number(reserved);

    const thresholdValue =
      Number(
        lowStockThreshold,
      );

    /*
     * -------------------------------------------------------
     * PRICE VALIDATION
     * -------------------------------------------------------
     */

    if (
      !Number.isFinite(
        mrpValue,
      ) ||
      mrpValue < 0
    ) {
      toast.error(
        "Enter a valid MRP.",
      );
      return;
    }

    if (
      !Number.isFinite(
        sellingPriceValue,
      ) ||
      sellingPriceValue < 0
    ) {
      toast.error(
        "Enter a valid selling price.",
      );
      return;
    }

    let compareValue:
      | number
      | undefined;

    if (
      compareAtPrice.trim()
    ) {
      compareValue =
        Number(
          compareAtPrice,
        );

      if (
        !Number.isFinite(
          compareValue,
        ) ||
        compareValue < 0
      ) {
        toast.error(
          "Enter a valid compare-at price.",
        );
        return;
      }
    }

    /*
     * -------------------------------------------------------
     * INVENTORY VALIDATION
     * -------------------------------------------------------
     */

    if (
      !Number.isInteger(
        stockValue,
      ) ||
      stockValue < 0
    ) {
      toast.error(
        "Stock must be a non-negative whole number.",
      );
      return;
    }

    if (
      !Number.isInteger(
        reservedValue,
      ) ||
      reservedValue < 0
    ) {
      toast.error(
        "Reserved stock must be a non-negative whole number.",
      );
      return;
    }

    if (
      reservedValue >
      stockValue
    ) {
      toast.error(
        "Reserved stock cannot exceed total stock.",
      );
      return;
    }

    if (
      !Number.isInteger(
        thresholdValue,
      ) ||
      thresholdValue < 0
    ) {
      toast.error(
        "Low-stock threshold must be a non-negative whole number.",
      );
      return;
    }

    /*
     * -------------------------------------------------------
     * WEIGHT
     * -------------------------------------------------------
     */

    let weightValue:
      | number
      | undefined;

    if (weight.trim()) {
      weightValue =
        Number(weight);

      if (
        !Number.isFinite(
          weightValue,
        ) ||
        weightValue < 0
      ) {
        toast.error(
          "Weight must be a non-negative number.",
        );
        return;
      }
    }

    /*
     * -------------------------------------------------------
     * CANONICAL PRODUCT TYPES
     * -------------------------------------------------------
     */

    const color: ProductColor =
      {
        id: getColorId(
          selectedColor,
        ),

        name:
          selectedColor.name,

        slug:
          selectedColor.slug,

        ...(selectedColor.hex
          ? {
              hex:
                selectedColor.hex,
            }
          : {}),

        ...(selectedColor
          .swatchImage
          ? {
              swatchImage:
                selectedColor.swatchImage,
            }
          : {}),
      };

    const size: ProductSize =
      {
        code:
          selectedSize.code,

        label:
          selectedSize.label,

        sortOrder:
          selectedSize.sortOrder,
      };

    const pricing: ProductPricing =
      {
        mrp: mrpValue,

        sellingPrice:
          sellingPriceValue,

        currency: "INR",

        ...(compareValue !==
        undefined
          ? {
              compareAtPrice:
                compareValue,
            }
          : {}),
      };

    /*
     * =======================================================
     * UPDATE
     * =======================================================
     */

    if (
      isEdit &&
      variant
    ) {
      const payload:
        UpdateProductVariantInput =
        {
          sku: sku.trim(),

          ...(barcode.trim()
            ? {
                barcode:
                  barcode.trim(),
              }
            : {}),

          color,

          size,

          pricing,

          ...(weightValue !==
          undefined
            ? {
                weight:
                  weightValue,
              }
            : {}),

          status,
        };

      await onUpdate(
        variant.id,
        payload,
      );

      return;
    }

    /*
     * =======================================================
     * CREATE
     * =======================================================
     */

    const payload:
      CreateProductVariantInput =
      {
        id: createVariantId(),

        sku: sku.trim(),

        ...(barcode.trim()
          ? {
              barcode:
                barcode.trim(),
            }
          : {}),

        color,

        size,

        pricing,

        inventory: {
          stock:
            stockValue,

          reserved:
            reservedValue,

          lowStockThreshold:
            thresholdValue,
        },

        ...(weightValue !==
        undefined
          ? {
              weight:
                weightValue,
            }
          : {}),

        status,
      };

    await onCreate(
      payload,
    );
  };

  /*
   * =======================================================
   * CLOSED
   * =======================================================
   */

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#e7e2dd] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#171717]">
              {isEdit
                ? "Edit Variant"
                : "Add Variant"}
            </h2>

            <p className="mt-1 text-sm text-[#6f706f]">
              Configure SKU, size, color and pricing.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-[#969696] transition hover:bg-[#f5f1ec] hover:text-[#292c2c] disabled:opacity-50"
            aria-label="Close variant form"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto px-6 py-6">
          {mastersLoading ? (
            <div className="space-y-4">
              {Array.from({
                length: 8,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-11 animate-pulse rounded-xl bg-[#f5f1ec]"
                  />
                ),
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* IDENTITY */}

              <section>
                <h3 className="text-sm font-semibold text-[#171717]">
                  Variant Identity
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                      SKU
                    </label>

                    <input
                      value={sku}
                      onChange={(
                        event,
                      ) =>
                        setSku(
                          event.target
                            .value,
                        )
                      }
                      disabled={saving}
                      placeholder="e.g. AF-ANR-PNK-M"
                      className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm text-[#171717] outline-none placeholder:text-[#969696] focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6] disabled:bg-[#f5f1ec]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                      Barcode
                    </label>

                    <input
                      value={barcode}
                      onChange={(
                        event,
                      ) =>
                        setBarcode(
                          event.target
                            .value,
                        )
                      }
                      disabled={saving}
                      placeholder="Optional"
                      className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm text-[#171717] outline-none placeholder:text-[#969696] focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                    />
                  </div>
                </div>
              </section>

              {/* OPTIONS */}

              <section>
                <h3 className="text-sm font-semibold text-[#171717]">
                  Variant Options
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                      Color
                    </label>

                    <select
                      value={colorId}
                      onChange={(
                        event,
                      ) =>
                        setColorId(
                          event.target
                            .value,
                        )
                      }
                      disabled={
                        saving ||
                        mastersLoading
                      }
                      className="h-11 w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                    >
                      <option value="">
                        Select color
                      </option>

                      {colors.map(
                        (
                          color,
                        ) => (
                          <option
                            key={getColorId(
                              color,
                            )}
                            value={getColorId(
                              color,
                            )}
                          >
                            {
                              color.name
                            }
                          </option>
                        ),
                      )}
                    </select>

                    {selectedColor?.hex && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-[#969696]">
                        <span
                          className="h-4 w-4 rounded-full border border-[#d8d1ca]"
                          style={{
                            backgroundColor:
                              selectedColor.hex,
                          }}
                        />

                        {
                          selectedColor.hex
                        }
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                      Size
                    </label>

                    <select
                      value={sizeCode}
                      onChange={(
                        event,
                      ) =>
                        setSizeCode(
                          event.target
                            .value,
                        )
                      }
                      disabled={
                        saving ||
                        mastersLoading
                      }
                      className="h-11 w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                    >
                      <option value="">
                        Select size
                      </option>

                      {sizes.map(
                        (size) => (
                          <option
                            key={
                              size.code
                            }
                            value={
                              size.code
                            }
                          >
                            {
                              size.label
                            }{" "}
                            (
                            {
                              size.code
                            }
                            )
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
              </section>

              {/* PRICING */}

              <section>
                <h3 className="text-sm font-semibold text-[#171717]">
                  Pricing
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                      MRP
                    </label>

                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={mrp}
                      onChange={(
                        event,
                      ) =>
                        setMrp(
                          event.target
                            .value,
                        )
                      }
                      disabled={saving}
                      className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                      Selling Price
                    </label>

                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={
                        sellingPrice
                      }
                      onChange={(
                        event,
                      ) =>
                        setSellingPrice(
                          event.target
                            .value,
                        )
                      }
                      disabled={saving}
                      className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                      Compare At Price
                    </label>

                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={
                        compareAtPrice
                      }
                      onChange={(
                        event,
                      ) =>
                        setCompareAtPrice(
                          event.target
                            .value,
                        )
                      }
                      disabled={saving}
                      placeholder="Optional"
                      className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none placeholder:text-[#969696] focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                    />
                  </div>
                </div>
              </section>

              {/* INVENTORY */}

              <section>
                <h3 className="text-sm font-semibold text-[#171717]">
                  Inventory
                </h3>

                {isEdit ? (
                  <div className="mt-4 rounded-xl border border-[#e7e2dd] bg-[#fcfbf9] p-4">
                    <p className="text-sm font-medium text-[#292c2c]">
                      Inventory is managed separately
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#6f706f]">
                      Use the Inventory module to adjust stock, reservations and low-stock thresholds.
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-[#969696]">
                          Stock
                        </p>

                        <p className="mt-1 font-semibold text-[#171717]">
                          {stock}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#969696]">
                          Reserved
                        </p>

                        <p className="mt-1 font-semibold text-[#171717]">
                          {reserved}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#969696]">
                          Threshold
                        </p>

                        <p className="mt-1 font-semibold text-[#171717]">
                          {
                            lowStockThreshold
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                        Initial Stock
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={
                          stock
                        }
                        onChange={(
                          event,
                        ) =>
                          setStock(
                            event.target
                              .value,
                          )
                        }
                        disabled={
                          saving
                        }
                        className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                        Reserved
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={
                          reserved
                        }
                        onChange={(
                          event,
                        ) =>
                          setReserved(
                            event.target
                              .value,
                          )
                        }
                        disabled={
                          saving
                        }
                        className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                        Low Stock Threshold
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={
                          lowStockThreshold
                        }
                        onChange={(
                          event,
                        ) =>
                          setLowStockThreshold(
                            event.target
                              .value,
                          )
                        }
                        disabled={
                          saving
                        }
                        className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* ADDITIONAL */}

              <section>
                <h3 className="text-sm font-semibold text-[#171717]">
                  Additional Details
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                      Weight
                    </label>

                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={weight}
                      onChange={(
                        event,
                      ) =>
                        setWeight(
                          event.target
                            .value,
                        )
                      }
                      disabled={saving}
                      placeholder="Optional"
                      className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none placeholder:text-[#969696] focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(
                        event,
                      ) =>
                        setStatus(
                          event.target
                            .value as VariantStatus,
                        )
                      }
                      disabled={
                        saving
                      }
                      className="h-11 w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791] disabled:bg-[#f5f1ec]"
                    >
                      <option value="active">
                        Active
                      </option>

                      <option value="inactive">
                        Inactive
                      </option>

                      <option value="discontinued">
                        Discontinued
                      </option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-3 border-t border-[#e7e2dd] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-[#d8d1ca] px-4 py-2.5 text-sm font-medium text-[#292c2c] transition hover:bg-[#fcfbf9] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              void submit()
            }
            disabled={
              saving ||
              mastersLoading
            }
            className="rounded-xl bg-[#171717] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#292c2c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Create Variant"}
          </button>
        </div>
      </div>
    </div>
  );
}