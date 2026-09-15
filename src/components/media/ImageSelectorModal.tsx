"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Check,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";

import {
  listImages,
  type ListedImage,
  type UploadFolder,
  type UploadResource,
} from "@/services/upload.service";

interface ImageSelectorModalProps {
  open: boolean;
  accessToken: string | null;
  resource: UploadResource;
  resourceId?: string;
  folder: UploadFolder;
  selectedUrl?: string;
  title?: string;
  onSelect: (image: ListedImage) => void;
  onClose: () => void;
}

export function ImageSelectorModal({
  open,
  accessToken,
  resource,
  resourceId,
  folder,
  selectedUrl,
  title = "Select Image",
  onSelect,
  onClose,
}: ImageSelectorModalProps) {
  const [images, setImages] = useState<
    ListedImage[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!accessToken) {
      setImages([]);
      setError(
        "Authentication required.",
      );
      return;
    }

    let cancelled = false;

    async function loadImages() {

        if (!accessToken) {
           return;
        }

      setLoading(true);
      setError("");

      try {
        const result =
          await listImages(
            accessToken,
            {
              resource,
              resourceId,
              folder,
            },
          );

        if (!cancelled) {
          setImages(result);
        }
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load images:",
          loadError,
        );

        setImages([]);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load images.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadImages();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    accessToken,
    resource,
    resourceId,
    folder,
  ]);

  useEffect(() => {
    if (!open) {
      setImages([]);
      setError("");
      setLoading(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e3ded8] px-5 py-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#9a928b]">
              Media Library
            </p>

            <h2 className="mt-1 font-serif text-xl text-[#292624]">
              {title}
            </h2>

            <p className="mt-1 text-[11px] text-[#9a928b]">
              {resource} / {folder}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-[#ddd7d1] text-[#77736e] transition hover:border-[#9f1239] hover:text-[#9f1239]"
            aria-label="Close image selector"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="flex min-h-[280px] flex-col items-center justify-center">
              <Loader2
                size={28}
                className="animate-spin text-[#9f1239]"
              />

              <p className="mt-3 text-xs text-[#77736e]">
                Loading images...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center border border-red-200 bg-red-50 text-red-500">
                <X size={20} />
              </div>

              <p className="mt-4 text-sm font-medium text-[#393532]">
                Unable to load images
              </p>

              <p className="mt-1 max-w-md text-xs text-[#77736e]">
                {error}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            images.length === 0 && (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center border border-[#e1dbd5] bg-[#faf9f7] text-[#aaa39d]">
                  <ImageIcon size={24} />
                </div>

                <p className="mt-4 text-sm font-medium text-[#393532]">
                  No images found
                </p>

                <p className="mt-1 text-xs text-[#77736e]">
                  Upload an image first, then it
                  will appear here.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.map((image) => {
                  const isSelected =
                    selectedUrl ===
                    image.url;

                  return (
                    <button
                      key={image.publicId}
                      type="button"
                      onClick={() =>
                        onSelect(image)
                      }
                      className={[
                        "group relative overflow-hidden border bg-white text-left transition",
                        isSelected
                          ? "border-[#9f1239] ring-2 ring-[#9f1239]/20"
                          : "border-[#e1dbd5] hover:border-[#9f1239]",
                      ].join(" ")}
                    >
                      {/* Image */}
                      <div className="aspect-square overflow-hidden bg-[#f3f0ed]">
                        <img
                          src={image.url}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-[#9f1239] text-white shadow">
                          <Check size={15} />
                        </div>
                      )}

                      {/* Image information */}
                      <div className="border-t border-[#e8e2dc] px-2.5 py-2">
                        <p className="truncate text-[10px] font-medium text-[#55504b]">
                          {image.format
                            ?.toUpperCase() ||
                            "IMAGE"}
                        </p>

                        {image.width &&
                          image.height && (
                            <p className="mt-0.5 text-[10px] text-[#9a928b]">
                              {image.width} ×{" "}
                              {image.height}
                            </p>
                          )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e3ded8] px-5 py-3">
          <p className="text-[11px] text-[#9a928b]">
            {images.length}{" "}
            {images.length === 1
              ? "image"
              : "images"}{" "}
            available
          </p>

          <button
            type="button"
            onClick={onClose}
            className="border border-[#d6d0ca] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#55504b] transition hover:border-[#9f1239] hover:text-[#9f1239]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}