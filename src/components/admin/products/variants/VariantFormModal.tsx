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

const labelClassName =
  "mb-1.5 block break-words text-xs font-medium leading-5 text-[#292c2c]";

const inputClassName =
  "box-border h-10 min-w-0 w-full max-w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#171717] outline-none transition placeholder:text-[#969696] focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6] disabled:cursor-not-allowed disabled:bg-[#f5f1ec]";

const selectClassName =
  "box-border h-10 min-w-0 w-full max-w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm text-[#292c2c] outline-none transition focus:border-[#d98791] focus:ring-2 focus:ring-[#f9e4e6] disabled:cursor-not-allowed disabled:bg-[#f5f1ec]";

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
  void productId;

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

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div className="my-auto flex max-h-[calc(100vh-32px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#e7e2dd] px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="break-words text-base font-semibold leading-6 text-[#171717] sm:text-lg">
              {isEdit
                ? "Edit Variant"
                : "Add Variant"}
            </h2>

            <p className="mt-0.5 break-words text-xs leading-5 text-[#6f706f] sm:text-sm">
              Configure SKU, size, color and pricing.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#969696] transition hover:bg-[#f5f1ec] hover:text-[#292c2c] disabled:opacity-50"
            aria-label="Close variant form"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {mastersLoading ? (
            <div className="space-y-3">
              {Array.from({
                length: 8,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-10 animate-pulse rounded-xl bg-[#f5f1ec]"
                  />
                ),
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* IDENTITY */}
              <section className="min-w-0">
                <h3 className="text-sm font-semibold leading-5 text-[#171717]">
                  Variant Identity
                </h3>

                <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label className={labelClassName}>
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
                      className={inputClassName}
                    />
                  </div>

                  <div className="min-w-0">
                    <label className={labelClassName}>
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
                      className={inputClassName}
                    />
                  </div>
                </div>
              </section>

              {/* OPTIONS */}
              <section className="min-w-0">
                <h3 className="text-sm font-semibold leading-5 text-[#171717]">
                  Variant Options
                </h3>

                <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label className={labelClassName}>
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
                      className={selectClassName}
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
                          className="h-4 w-4 shrink-0 rounded-full border border-[#d8d1ca]"
                          style={{
                            backgroundColor:
                              selectedColor.hex,
                          }}
                        />

                        <span className="break-all">
                          {
                            selectedColor.hex
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label className={labelClassName}>
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
                      className={selectClassName}
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
              <section className="min-w-0">
                <h3 className="text-sm font-semibold leading-5 text-[#171717]">
                  Pricing
                </h3>

                <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="min-w-0">
                    <label className={labelClassName}>
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
                      className={inputClassName}
                    />
                  </div>

                  <div className="min-w-0">
                    <label className={labelClassName}>
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
                      className={inputClassName}
                    />
                  </div>

                  <div className="min-w-0">
                    <label className={labelClassName}>
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
                      className={inputClassName}
                    />
                  </div>
                </div>
              </section>

              {/* INVENTORY */}
              <section className="min-w-0">
                <h3 className="text-sm font-semibold leading-5 text-[#171717]">
                  Inventory
                </h3>

                {isEdit ? (
                  <div className="mt-3 rounded-xl border border-[#e7e2dd] bg-[#fcfbf9] p-3.5">
                    <p className="break-words text-sm font-medium leading-5 text-[#292c2c]">
                      Inventory is managed separately
                    </p>

                    <p className="mt-1 break-words text-xs leading-5 text-[#6f706f]">
                      Use the Inventory module to adjust stock, reservations and low-stock thresholds.
                    </p>

                    <div className="mt-3 grid grid-cols-3 gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#969696]">
                          Stock
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#171717]">
                          {stock}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] text-[#969696]">
                          Reserved
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#171717]">
                          {reserved}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] text-[#969696]">
                          Threshold
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#171717]">
                          {
                            lowStockThreshold
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="min-w-0">
                      <label className={labelClassName}>
                        Initial Stock
                      </label>

                      <input
                        type="number"
                        min={0}
                        value={stock}
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
                        className={inputClassName}
                      />
                    </div>

                    <div className="min-w-0">
                      <label className={labelClassName}>
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
                        className={inputClassName}
                      />
                    </div>

                    <div className="min-w-0">
                      <label className={labelClassName}>
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
                        className={inputClassName}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* ADDITIONAL */}
              <section className="min-w-0">
                <h3 className="text-sm font-semibold leading-5 text-[#171717]">
                  Additional Details
                </h3>

                <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label className={labelClassName}>
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
                      className={inputClassName}
                    />
                  </div>

                  <div className="min-w-0">
                    <label className={labelClassName}>
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
                      className={selectClassName}
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
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#e7e2dd] bg-white px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-10 rounded-xl border border-[#d8d1ca] px-4 text-sm font-medium text-[#292c2c] transition hover:bg-[#fcfbf9] disabled:cursor-not-allowed disabled:opacity-50"
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
            className="h-10 rounded-xl bg-[#171717] px-5 text-sm font-medium text-white transition hover:bg-[#292c2c] disabled:cursor-not-allowed disabled:opacity-60"
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