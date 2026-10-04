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
      <section className="surface min-w-0 overflow-hidden p-5 sm:p-6">
        {/* HEADER */}
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="display break-words text-[26px] font-semibold leading-tight text-[#f8f3f1]">
              Media
            </h2>

            <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#cfc7bb]">
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
            className={`${buttonBaseClass} h-10 shrink-0 gap-2 rounded-xl bg-[#b79a6a] px-4 text-sm font-medium text-[#111111] hover:opacity-90`}
          >
            <Plus size={15} />
            Add Media
          </button>
        </div>

        {/* MEDIA CONTENT */}
        {media.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#3a352f] bg-[#111111] px-5 py-12 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#211e1b]">
              <Plus size={18} className="text-[#9a9185]" />
            </div>

            <p className="mt-3 break-words text-sm font-medium text-[#f8f3f1]">
              No media uploaded yet
            </p>

            <p className="mx-auto mt-1.5 max-w-md break-words text-xs leading-5 text-[#9a9185]">
              Upload product images, videos and gallery assets.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="min-w-0 overflow-hidden rounded-2xl border border-[#2e2a26] bg-[#1a1816] shadow-sm transition-shadow hover:shadow-md"
              >
                {/* MEDIA PREVIEW */}
                <div className="relative aspect-[4/5] bg-[#111111]">
                  {item.type === "image" && item.src ? (
                    <Image
                      src={item.src}
                      alt={item.alt ?? "Product media"}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-xs capitalize text-[#9a9185]">
                      {item.type}
                    </div>
                  )}

                  {/* PRIMARY BADGE */}
                  {item.isPrimary && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#b79a6a] px-2.5 py-1 text-[10px] font-medium text-[#111111] shadow-sm">
                      Primary
                    </span>
                  )}
                </div>

                {/* CARD DETAILS */}
                <div className="min-w-0 p-3.5">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium leading-5 text-[#f8f3f1]">
                      {item.type === "image" ? "Image" : "Video"}
                    </p>

                    {item.alt && (
                      <p className="mt-1 break-words text-xs leading-5 text-[#9a9185]">
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
                      className={`${buttonBaseClass} h-9 min-w-0 flex-1 gap-1.5 rounded-xl border border-[#3a352f] bg-[#1a1816] px-3 text-xs font-medium text-[#f8f3f1] hover:bg-[#111111]`}
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => void onDeleteMedia(item.id)}
                      className={`${buttonBaseClass} h-9 w-10 shrink-0 rounded-xl border border-[#2b1a18] bg-[#1a1816] text-[#e08b84] hover:bg-[#2b1a18]`}
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