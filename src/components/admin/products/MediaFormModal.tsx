"use client";

import {
  useEffect,
  useState,
} from "react";

import { X } from "lucide-react";

import type {
  ProductMedia,
} from "@/types/product";

interface MediaFormModalProps {
  open: boolean;
  media: ProductMedia | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (
    media: ProductMedia,
  ) => Promise<void>;
}

function createId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `media-${Date.now()}`;
}

export default function MediaFormModal({
  open,
  media,
  saving = false,
  onClose,
  onSave,
}: MediaFormModalProps) {
  const [src, setSrc] =
    useState("");

  const [alt, setAlt] =
    useState("");

  const [type, setType] =
    useState<ProductMedia["type"]>(
      "image",
    );

  const [
    imageType,
    setImageType,
  ] = useState<
    NonNullable<
      ProductMedia["imageType"]
    > | ""
  >("");

  const [
    colorId,
    setColorId,
  ] = useState("");

  const [
    sortOrder,
    setSortOrder,
  ] = useState("0");

  const [
    isPrimary,
    setIsPrimary,
  ] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (media) {
      setSrc(media.src);
      setAlt(media.alt ?? "");
      setType(media.type);
      setImageType(
        media.imageType ?? "",
      );
      setColorId(
        media.colorId ?? "",
      );
      setSortOrder(
        String(
          media.sortOrder ?? 0,
        ),
      );
      setIsPrimary(
        media.isPrimary === true,
      );
      return;
    }

    setSrc("");
    setAlt("");
    setType("image");
    setImageType("");
    setColorId("");
    setSortOrder("0");
    setIsPrimary(false);
  }, [open, media]);

  if (!open) {
    return null;
  }

  const save = async () => {
    if (!src.trim()) {
      window.alert(
        "Media URL is required.",
      );
      return;
    }

    await onSave({
      id:
        media?.id ??
        createId(),

      type,

      src: src.trim(),

      ...(alt.trim()
        ? {
            alt:
              alt.trim(),
          }
        : {}),

      ...(imageType
        ? {
            imageType,
          }
        : {}),

      ...(colorId.trim()
        ? {
            colorId:
              colorId.trim(),
          }
        : {}),

      sortOrder: Math.max(
        0,
        Number(sortOrder) || 0,
      ),

      isPrimary,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e7e2dd] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#171717]">
              {media
                ? "Edit Media"
                : "Add Media"}
            </h2>

            <p className="mt-1 text-sm text-[#6f706f]">
              Add an image, video or
              external media URL.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-[#969696] hover:bg-[#f5f1ec]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
              Source URL
            </span>

            <input
              value={src}
              onChange={(event) =>
                setSrc(
                  event.target.value,
                )
              }
              placeholder="https://..."
              className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                Media Type
              </span>

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target
                      .value as ProductMedia["type"],
                  )
                }
                className="h-11 w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
              >
                <option value="image">
                  Image
                </option>

                <option value="video">
                  Video
                </option>

                <option value="external-video">
                  External Video
                </option>

                <option value="360">
                  360
                </option>
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                Image Type
              </span>

              <select
                value={imageType}
                onChange={(event) =>
                  setImageType(
                    event.target
                      .value as typeof imageType,
                  )
                }
                className="h-11 w-full rounded-xl border border-[#d8d1ca] bg-white px-3 text-sm outline-none focus:border-[#d98791]"
              >
                <option value="">
                  None
                </option>

                <option value="model">
                  Model
                </option>

                <option value="front">
                  Front
                </option>

                <option value="back">
                  Back
                </option>

                <option value="detail">
                  Detail
                </option>

                <option value="flat-lay">
                  Flat Lay
                </option>

                <option value="lifestyle">
                  Lifestyle
                </option>

                <option value="video-poster">
                  Video Poster
                </option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                Alt Text
              </span>

              <input
                value={alt}
                onChange={(event) =>
                  setAlt(
                    event.target.value,
                  )
                }
                placeholder="Ivory embroidered suit"
                className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791]"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
                Sort Order
              </span>

              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791]"
              />
            </label>
          </div>

          <label>
            <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
              Variant Color ID
            </span>

            <input
              value={colorId}
              onChange={(event) =>
                setColorId(
                  event.target.value,
                )
              }
              placeholder="Optional color master ID"
              className="h-11 w-full rounded-xl border border-[#d8d1ca] px-3 text-sm outline-none focus:border-[#d98791]"
            />
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(event) =>
                setIsPrimary(
                  event.target
                    .checked,
                )
              }
              className="h-4 w-4 rounded border-[#d8d1ca] accent-[#171717]"
            />

            <span className="text-sm text-[#292c2c]">
              Make this the primary
              media
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#e7e2dd] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-[#d8d1ca] px-4 py-2.5 text-sm font-medium text-[#292c2c]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              void save()
            }
            disabled={saving}
            className="rounded-xl bg-[#171717] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Media"}
          </button>
        </div>
      </div>
    </div>
  );
}