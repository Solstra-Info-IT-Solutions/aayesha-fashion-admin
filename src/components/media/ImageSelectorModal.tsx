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
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  deleteImage,
  listImages,
  uploadImage,
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
  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [
    images,
    setImages,
  ] = useState<ListedImage[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    deletingPublicId,
    setDeletingPublicId,
  ] = useState<string | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    uploadError,
    setUploadError,
  ] = useState("");

  /* =======================================================
     LOAD IMAGES
  ======================================================= */

  async function loadImages(): Promise<void> {
    if (!accessToken) {
      setImages([]);
      setError(
        "Authentication required.",
      );
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

      setImages(result);
    } catch (loadError) {
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
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    void loadImages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    accessToken,
    resource,
    resourceId,
    folder,
  ]);

  /* =======================================================
     RESET WHEN CLOSED
  ======================================================= */

  useEffect(() => {
    if (!open) {
      setImages([]);
      setError("");
      setUploadError("");
      setLoading(false);
      setUploading(false);
      setDeletingPublicId(null);
    }
  }, [open]);

  /* =======================================================
     OPEN FILE PICKER
  ======================================================= */

  function openFilePicker(): void {
    setUploadError("");

    fileInputRef.current?.click();
  }

  /* =======================================================
     UPLOAD
  ======================================================= */

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file =
      event.target.files?.[0];

    /*
     * Allow selecting the same file again.
     */
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!accessToken) {
      setUploadError(
        "Authentication required.",
      );

      return;
    }

    if (
      !resourceId &&
      resource !== "homepage"
    ) {
      setUploadError(
        "Save this record first before uploading an image.",
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
    setError("");

    try {
      const uploaded =
        await uploadImage(
          accessToken,
          file,
          {
            resource,
            resourceId,
            folder,
          },
        );

      /*
       * Refresh the media library after
       * successful upload.
       */
      const updatedImages =
        await listImages(
          accessToken,
          {
            resource,
            resourceId,
            folder,
          },
        );

      setImages(
        updatedImages,
      );

      /*
       * Automatically select the newly
       * uploaded image.
       */
      const uploadedImage =
        updatedImages.find(
          (image) =>
            image.publicId ===
            uploaded.publicId,
        );

      if (uploadedImage) {
        onSelect(
          uploadedImage,
        );
      } else {
        /*
         * Fallback in case Cloudinary list
         * has not returned the new image yet.
         */
        onSelect({
          url:
            uploaded.url,
          publicId:
            uploaded.publicId,
          width:
            uploaded.width,
          height:
            uploaded.height,
          format:
            uploaded.format,
          bytes:
            uploaded.bytes,
        });
      }
    } catch (uploadErrorValue) {
      console.error(
        "Image upload failed:",
        uploadErrorValue,
      );

      setUploadError(
        uploadErrorValue instanceof Error
          ? uploadErrorValue.message
          : "Failed to upload image.",
      );
    } finally {
      setUploading(false);
    }
  }

  /* =======================================================
     DELETE
  ======================================================= */

  async function handleDelete(
    image: ListedImage,
  ): Promise<void> {
    if (!accessToken) {
      setError(
        "Authentication required.",
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this image? This action cannot be undone.",
      );

    if (!confirmed) {
      return;
    }

    setDeletingPublicId(
      image.publicId,
    );

    setError("");

    try {
      await deleteImage(
        accessToken,
        {
          publicId:
            image.publicId,
          resource,
          resourceId,
          folder,
        },
      );

      /*
       * Remove deleted image immediately
       * from local state.
       */
      setImages(
        (current) =>
          current.filter(
            (item) =>
              item.publicId !==
              image.publicId,
          ),
      );
    } catch (deleteError) {
      console.error(
        "Image deletion failed:",
        deleteError,
      );

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete image.",
      );
    } finally {
      setDeletingPublicId(
        null,
      );
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  if (!open) {
    return null;
  }

  const canUpload =
    Boolean(
      accessToken &&
        (
          resource === "homepage" ||
          resourceId
        ),
    );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-2xl">
        {/* =================================================
            HEADER
        ================================================= */}

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
            disabled={uploading}
            className="flex h-9 w-9 items-center justify-center border border-[#ddd7d1] text-[#77736e] transition hover:border-[#9f1239] hover:text-[#9f1239] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close image selector"
          >
            <X size={17} />
          </button>
        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="flex flex-col gap-3 border-b border-[#e8e2dc] bg-[#fcfbf9] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-[#393532]">
              {images.length}{" "}
              {images.length === 1
                ? "image"
                : "images"}{" "}
              available
            </p>

            <p className="mt-0.5 text-[11px] text-[#9a928b]">
              Upload images directly to this
              media folder.
            </p>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleFileChange
              }
              className="hidden"
            />

            <button
              type="button"
              onClick={
                openFilePicker
              }
              disabled={
                !canUpload ||
                uploading
              }
              className="inline-flex items-center gap-2 bg-[#292624] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[#9f1239] disabled:cursor-not-allowed disabled:opacity-50"
              title={
                !canUpload
                  ? "Save this record first"
                  : "Upload a new image"
              }
            >
              {uploading ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : (
                <Plus size={15} />
              )}

              {uploading
                ? "Uploading..."
                : "Upload New Image"}
            </button>
          </div>
        </div>

        {/* =================================================
            UPLOAD ERROR
        ================================================= */}

        {uploadError && (
          <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-xs text-red-700">
            {uploadError}
          </div>
        )}

        {/* =================================================
            CONTENT
        ================================================= */}

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

              <button
                type="button"
                onClick={() =>
                  void loadImages()
                }
                className="mt-4 border border-[#d6d0ca] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#55504b] transition hover:border-[#9f1239] hover:text-[#9f1239]"
              >
                Try Again
              </button>
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

                <p className="mt-1 max-w-sm text-xs leading-5 text-[#77736e]">
                  {canUpload
                    ? "Upload your first image to this media folder."
                    : "Save this record first, then you can upload images to its media folder."}
                </p>

                {canUpload && (
                  <button
                    type="button"
                    onClick={
                      openFilePicker
                    }
                    disabled={
                      uploading
                    }
                    className="mt-5 inline-flex items-center gap-2 border border-[#292624] px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#292624] transition hover:bg-[#292624] hover:text-white disabled:opacity-50"
                  >
                    <Upload size={14} />

                    Upload First Image
                  </button>
                )}
              </div>
            )}

          {!loading &&
            !error &&
            images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.map(
                  (image) => {
                    const isSelected =
                      selectedUrl ===
                      image.url;

                    const isDeleting =
                      deletingPublicId ===
                      image.publicId;

                    return (
                      <div
                        key={
                          image.publicId
                        }
                        className={[
                          "group relative overflow-hidden border bg-white transition",
                          isSelected
                            ? "border-[#9f1239] ring-2 ring-[#9f1239]/20"
                            : "border-[#e1dbd5]",
                        ].join(" ")}
                      >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-[#f3f0ed]">
                          <img
                            src={
                              image.url
                            }
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                          />

                          {/* Selected indicator */}
                          {isSelected && (
                            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-[#9f1239] text-white shadow">
                              <Check
                                size={
                                  15
                                }
                              />
                            </div>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() =>
                              void handleDelete(
                                image,
                              )
                            }
                            disabled={
                              isDeleting ||
                              uploading
                            }
                            className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center bg-white/95 text-[#55504b] shadow transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Delete image"
                            title="Delete image"
                          >
                            {isDeleting ? (
                              <Loader2
                                size={
                                  14
                                }
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={
                                  14
                                }
                              />
                            )}
                          </button>
                        </div>

                        {/* Information */}
                        <div className="border-t border-[#e8e2dc] px-2.5 py-2">
                          <p className="truncate text-[10px] font-medium text-[#55504b]">
                            {image.format
                              ?.toUpperCase() ||
                              "IMAGE"}
                          </p>

                          {image.width &&
                            image.height && (
                              <p className="mt-0.5 text-[10px] text-[#9a928b]">
                                {
                                  image.width
                                }{" "}
                                ×{" "}
                                {
                                  image.height
                                }
                              </p>
                            )}

                          {/* Actions */}
                          <div className="mt-2 flex gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                onSelect(
                                  image,
                                )
                              }
                              disabled={
                                isDeleting ||
                                uploading
                              }
                              className={[
                                "flex-1 px-2 py-2 text-[9px] font-medium uppercase tracking-[0.08em] transition",
                                isSelected
                                  ? "bg-[#9f1239] text-white"
                                  : "bg-[#292624] text-white hover:bg-[#9f1239]",
                              ].join(
                                " ",
                              )}
                            >
                              {isSelected
                                ? "Selected"
                                : "Select"}
                            </button>

                            {isSelected && (
                              <button
                                type="button"
                                onClick={
                                  openFilePicker
                                }
                                disabled={
                                  uploading ||
                                  !canUpload
                                }
                                className="inline-flex items-center justify-center border border-[#d6d0ca] px-2 text-[#55504b] transition hover:border-[#9f1239] hover:text-[#9f1239] disabled:cursor-not-allowed disabled:opacity-50"
                                title="Replace selected image"
                                aria-label="Replace selected image"
                              >
                                {uploading ? (
                                  <Loader2
                                    size={
                                      13
                                    }
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Upload
                                    size={
                                      13
                                    }
                                  />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex items-center justify-between border-t border-[#e3ded8] px-5 py-3">
          <p className="text-[11px] text-[#9a928b]">
            Images are stored in the selected
            Cloudinary media folder.
          </p>

          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="border border-[#d6d0ca] px-4 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#55504b] transition hover:border-[#9f1239] hover:text-[#9f1239] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}