"use client";

import { useState } from "react";

import Image from "next/image";

import { Pencil, Plus, Trash2 } from "lucide-react";

import type { ProductMedia } from "@/types/product";

import MediaFormModal from "./MediaFormModal";

interface ProductMediaSectionProps {
  productId: string;
  media: ProductMedia[];
  saving?: boolean;
  onSaveMedia: (media: ProductMedia) => Promise<void>;
  onDeleteMedia: (mediaId: string) => Promise<void>;
}

const buttonBaseClass =
  "inline-flex items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-50";

export default function ProductMediaSection({
  productId,
  media,
  saving = false,
  onSaveMedia,
  onDeleteMedia,
}: ProductMediaSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const [editingMedia, setEditingMedia] =
    useState<ProductMedia | null>(null);

  return (
    <>
      <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e6ddd4] bg-[#fbf9f5] p-4 sm:p-5">
        {/* HEADER */}
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-base font-semibold leading-6 text-[#3f2d2a]">
              Media
            </h2>

            <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#70635d]">
              Product imagery and supporting media.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => {
              setEditingMedia(null);
              setModalOpen(true);
            }}
            className={`${buttonBaseClass} h-10 shrink-0 gap-2 rounded-xl bg-[#7a5650] px-4 text-sm font-medium text-white hover:opacity-90`}
          >
            <Plus size={15} />
            Add Media
          </button>
        </div>

        {/* MEDIA CONTENT */}
        {media.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#d8cec5] bg-[#f7f3ed] px-5 py-12 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#efe8df]">
              <Plus size={18} className="text-[#958781]" />
            </div>

            <p className="mt-3 break-words text-sm font-medium text-[#3f2d2a]">
              No media uploaded yet
            </p>

            <p className="mx-auto mt-1.5 max-w-md break-words text-xs leading-5 text-[#958781]">
              Upload product images, videos and gallery assets.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="min-w-0 overflow-hidden rounded-2xl border border-[#e6ddd4] bg-[#fbf9f5] shadow-sm transition-shadow hover:shadow-md"
              >
                {/* MEDIA PREVIEW */}
                <div className="relative aspect-[4/5] bg-[#f7f3ed]">
                  {item.type === "image" && item.src ? (
                    <Image
                      src={item.src}
                      alt={item.alt ?? "Product media"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-xs capitalize text-[#958781]">
                      {item.type}
                    </div>
                  )}

                  {/* PRIMARY BADGE */}
                  {item.isPrimary && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#7a5650] px-2.5 py-1 text-[10px] font-medium text-white shadow-sm">
                      Primary
                    </span>
                  )}
                </div>

                {/* CARD DETAILS */}
                <div className="min-w-0 p-3.5">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium leading-5 text-[#3f2d2a]">
                      {item.type === "image" ? "Image" : "Video"}
                    </p>

                    {item.alt && (
                      <p className="mt-1 break-words text-xs leading-5 text-[#958781]">
                        {item.alt}
                      </p>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 flex min-w-0 gap-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setEditingMedia(item);
                        setModalOpen(true);
                      }}
                      className={`${buttonBaseClass} h-9 min-w-0 flex-1 gap-1.5 rounded-xl border border-[#d8cec5] bg-[#fbf9f5] px-3 text-xs font-medium text-[#3f2d2a] hover:bg-[#f7f3ed]`}
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void onDeleteMedia(item.id)}
                      className={`${buttonBaseClass} h-9 w-10 shrink-0 rounded-xl border border-[#f5eae6] bg-[#fbf9f5] text-[#955c56] hover:bg-[#f5eae6]`}
                      aria-label="Delete media"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MEDIA MODAL */}
      <MediaFormModal
        open={modalOpen}
        productId={productId}
        media={editingMedia}
        saving={saving}
        onClose={() => {
          setModalOpen(false);
          setEditingMedia(null);
        }}
        onSave={async (item) => {
          await onSaveMedia(item);

          setModalOpen(false);
          setEditingMedia(null);
        }}
      />
    </>
  );
}