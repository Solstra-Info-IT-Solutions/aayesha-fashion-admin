"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import type {
  ProductMedia,
} from "@/types/product";

import {
  uploadImage,
} from "@/services/upload.service";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

interface MediaFormModalProps {
  open: boolean;
  productId: string;
  media: ProductMedia | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (
    media: ProductMedia,
  ) => Promise<void>;
}

/* =========================================================
   HELPERS
========================================================= */

function createId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `media-${Date.now()}`;
}

/* =========================================================
   CONSTANTS
========================================================= */

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* =========================================================
   COMPONENT
========================================================= */

export default function MediaFormModal({
  open,
  productId,
  media,
  saving = false,
  onClose,
  onSave,
}: MediaFormModalProps) {
  const {
    accessToken,
  } = useAdminAuth();

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [src, setSrc] =
    useState("");

  const [alt, setAlt] =
    useState("");

  const [type, setType] =
    useState<ProductMedia["type"]>(
      "image",
    );

  const [
    sortOrder,
    setSortOrder,
  ] = useState("0");

  const [
    isPrimary,
    setIsPrimary,
  ] = useState(false);

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null,
  );

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    uploadError,
    setUploadError,
  ] = useState("");

  /* =======================================================
     LOAD MEDIA
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedFile(null);
    setUploadError("");

    if (media) {
      setSrc(
        media.src ?? "",
      );

      setAlt(
        media.alt ?? "",
      );

      setType(
        media.type,
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
    setSortOrder("0");
    setIsPrimary(false);
  }, [
    open,
    media,
  ]);

  /* =======================================================
     CLOSED
  ======================================================= */

  if (!open) {
    return null;
  }

  /* =======================================================
     FILE PICKER
  ======================================================= */

  function openFilePicker(): void {
    setUploadError("");

    fileInputRef.current?.click();
  }

  /* =======================================================
     FILE UPLOAD
  ======================================================= */

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file =
      event.target.files?.[0];

    /*
     * Allow selecting the same
     * file again.
     */
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!accessToken) {
      setUploadError(
        "Authentication required. Please login again.",
      );

      return;
    }

    if (!productId) {
      setUploadError(
        "Product ID is required before uploading media.",
      );

      return;
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type,
      )
    ) {
      setUploadError(
        "Only JPEG, PNG, and WebP images are allowed.",
      );

      return;
    }

    if (
      file.size > MAX_FILE_SIZE
    ) {
      setUploadError(
        "Image size must be 5 MB or less.",
      );

      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const uploaded =
        await uploadImage(
          accessToken,
          file,
          {
            resource: "product",
            resourceId:
              productId,
            folder: "images",
          },
        );

      setSrc(
        uploaded.url,
      );

      setSelectedFile(file);
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Unable to upload image.",
      );
    } finally {
      setUploading(false);
    }
  }

  /* =======================================================
     SAVE
  ======================================================= */

  async function save(): Promise<void> {
    if (!src.trim()) {
      setUploadError(
        "Please upload an image or enter a media URL.",
      );

      return;
    }

    const normalizedSortOrder =
      Math.max(
        0,
        Number(sortOrder) || 0,
      );

    await onSave({
      id:
        media?.id ??
        createId(),

      type,

      src:
        src.trim(),

      ...(alt.trim()
        ? {
            alt:
              alt.trim(),
          }
        : {}),

      sortOrder:
        normalizedSortOrder,

      isPrimary,
    });
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">
      <div className="my-auto flex max-h-[calc(100vh-32px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-[#e7e2dd] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#171717]">
              {media
                ? "Edit Media"
                : "Add Media"}
            </h2>

            <p className="mt-1 text-sm text-[#6f706f]">
              Upload product imagery
              or add an external
              media URL.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              saving ||
              uploading
            }
            className="rounded-lg p-2 text-[#969696] hover:bg-[#f5f1ec] disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">

          {/* =================================================
              UPLOAD
          ================================================= */}

          <div>
            <span className="mb-1.5 block text-sm font-medium text-[#292c2c]">
              Product Image
            </span>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                void handleFileChange(
                  event,
                )
              }
              className="hidden"
            />

            <button
              type="button"
              disabled={
                saving ||
                uploading
              }
              onClick={
                openFilePicker
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d8d1ca] bg-[#fcfbf9] px-4 py-7 text-sm font-medium text-[#292c2c] transition hover:border-[#d98791] hover:bg-[#fffaf9] disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Uploading to
                  Cloudinary...
                </>
              ) : (
                <>
                  <Upload
                    size={17}
                  />

                  Choose Image
                </>
              )}
            </button>

            <p className="mt-2 text-xs text-[#969696]">
              JPEG, PNG or WebP ·
              Maximum 5 MB
            </p>

            {selectedFile && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#f5f1ec] px-3 py-2 text-xs text-[#292c2c]">
                <Check
                  size={14}
                />

                <span className="truncate">
                  {
                    selectedFile.name
                  }
                </span>
              </div>
            )}

            {uploadError && (
              <p className="mt-2 text-xs text-[#a33a3a]">
                {uploadError}
              </p>
            )}
          </div>

          {/* =================================================
              PREVIEW
          ================================================= */}

          {src && (
            <div className="flex items-center gap-4 rounded-xl border border-[#e7e2dd] bg-[#fcfbf9] p-3">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-[#e7e2dd] bg-[#f5f1ec]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={
                    alt ||
                    "Product media preview"
                  }
                  className="h-full w-full object-cover"
                />

                <div className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-1 text-[9px] font-medium text-[#292c2c] shadow-sm">
                  <ImageIcon
                    size={10}
                  />

                  Preview
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-[#292c2c]">
                  Image uploaded
                </p>

                <p className="mt-1 text-xs leading-5 text-[#969696]">
                  This image will
                  be saved as
                  product media.
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              SOURCE URL
          ================================================= */}

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

            <p className="mt-1.5 text-xs text-[#969696]">
              Cloudinary URL is
              filled automatically
              after upload.
            </p>
          </label>

          {/* =================================================
              MEDIA TYPE
          ================================================= */}

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
            </select>
          </label>

          {/* =================================================
              ALT + SORT
          ================================================= */}

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

          {/* =================================================
              PRIMARY MEDIA
          ================================================= */}

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPrimary}
              onChange={(event) =>
                setIsPrimary(
                  event.target.checked,
                )
              }
              className="h-4 w-4 rounded border-[#d8d1ca] accent-[#171717]"
            />

            <span className="text-sm text-[#292c2c]">
              Make this the
              primary media
            </span>
          </label>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex justify-end gap-3 border-t border-[#e7e2dd] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={
              saving ||
              uploading
            }
            className="rounded-xl border border-[#d8d1ca] px-4 py-2.5 text-sm font-medium text-[#292c2c] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() =>
              void save()
            }
            disabled={
              saving ||
              uploading ||
              !src.trim()
            }
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