"use client";

import {
  useState,
} from "react";

import Image from "next/image";

import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  ProductMedia,
} from "@/types/product";

import MediaFormModal from "./MediaFormModal";

interface ProductMediaSectionProps {
  productId: string;
  media: ProductMedia[];
  saving?: boolean;
  onSaveMedia: (
    media: ProductMedia,
  ) => Promise<void>;
  onDeleteMedia: (
    mediaId: string,
  ) => Promise<void>;
}

export default function ProductMediaSection({
  productId,
  media,
  saving = false,
  onSaveMedia,
  onDeleteMedia,
}: ProductMediaSectionProps) {
  void productId;

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    editingMedia,
    setEditingMedia,
  ] =
    useState<ProductMedia | null>(
      null,
    );

  return (
    <>
      <section className="rounded-2xl border border-[#e7e2dd] bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#171717]">
              Media
            </h2>

            <p className="mt-1 text-sm text-[#6f706f]">
              Product imagery and supporting
              media.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => {
              setEditingMedia(
                null,
              );
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#171717] px-3.5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            <Plus size={15} />
            Add Media
          </button>
        </div>

        {media.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-[#d8d1ca] px-4 py-10 text-center text-sm text-[#969696]">
            No product media added.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {media.map(
              (item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-[#e7e2dd]"
                >
                  <div className="relative aspect-[4/5] bg-[#f5f1ec]">
                    {item.type ===
                      "image" &&
                    item.src ? (
                      <Image
                        src={
                          item.src
                        }
                        alt={
                          item.alt ??
                          "Product media"
                        }
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs capitalize text-[#969696]">
                        {
                          item.type
                        }
                      </div>
                    )}

                    {item.isPrimary && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#171717] px-2.5 py-1 text-[10px] font-medium text-white">
                        Primary
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="truncate text-xs text-[#6f706f]">
                      {item.imageType ??
                        item.type}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => {
                          setEditingMedia(
                            item,
                          );
                          setModalOpen(
                            true,
                          );
                        }}
                        className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#d8d1ca] text-xs font-medium text-[#292c2c]"
                      >
                        <Pencil
                          size={
                            13
                          }
                        />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={
                          saving
                        }
                        onClick={() =>
                          void onDeleteMedia(
                            item.id,
                          )
                        }
                        className="flex h-8 w-9 items-center justify-center rounded-lg border border-[#efd2d2] text-[#a33a3a]"
                        aria-label="Delete media"
                      >
                        <Trash2
                          size={
                            13
                          }
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      <MediaFormModal
        open={modalOpen}
        media={editingMedia}
        saving={saving}
        onClose={() => {
          setModalOpen(false);
          setEditingMedia(
            null,
          );
        }}
        onSave={async (item) => {
          await onSaveMedia(
            item,
          );

          setModalOpen(false);
          setEditingMedia(
            null,
          );
        }}
      />
    </>
  );
}