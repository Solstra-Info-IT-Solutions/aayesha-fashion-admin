"use client";

import { useState } from "react";
import {
  Archive,
  EyeOff,
  Globe,
  Trash2,
} from "lucide-react";

import type {
  Product,
} from "@/types/admin-product";

interface ProductPublishSectionProps {
  product: Product;
  saving?: boolean;
  onPublish: () => Promise<void>;
  onDraft: () => Promise<void>;
  onArchive: () => Promise<void>;
  onUnpublish: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const buttonBaseClass =
  "flex h-10 min-w-0 w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

export default function ProductPublishSection({
  product,
  saving = false,
  onPublish,
  onDraft,
  onArchive,
  onUnpublish,
  onDelete,
}: ProductPublishSectionProps) {
  const [
    action,
    setAction,
  ] = useState<string | null>(null);

  const [
    showDeleteConfirm,
    setShowDeleteConfirm,
  ] = useState(false);

  const run = async (
    key: string,
    callback: () => Promise<void>,
  ) => {
    setAction(key);

    try {
      await callback();
    } finally {
      setAction(null);
    }
  };

  const handleDelete = async () => {
    setAction("delete");

    try {
      await onDelete();
    } finally {
      setAction(null);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-[#e6dfcf] bg-[#fffdf8] p-4 sm:p-5">
      {/* HEADER */}
      <div className="min-w-0">
        <h2 className="break-words text-base font-semibold leading-6 text-[#2a2520]">
          Publish
        </h2>

        <p className="mt-1 max-w-full break-words text-sm leading-5 text-[#5f584d]">
          Control storefront availability and
          product lifecycle.
        </p>
      </div>

      {/* CURRENT STATUS */}
      <div className="mt-5 min-w-0 overflow-hidden rounded-xl bg-[#f7f2e7] p-3.5">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <span className="min-w-0 break-words text-xs font-medium leading-5 text-[#5f584d]">
            Current Status
          </span>

          <span className="shrink-0 rounded-full bg-[#26221d] px-2.5 py-1 text-[11px] font-medium capitalize leading-4 text-white">
            {product.status}
          </span>
        </div>

        {product.publishedAt && (
          <p className="mt-2.5 break-words text-[11px] leading-5 text-[#756d62]">
            Published{" "}
            {new Date(
              product.publishedAt,
            ).toLocaleString("en-IN")}
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-4 grid min-w-0 gap-2">
        {/* PUBLISH */}
        <button
          type="button"
          disabled={
            saving || action !== null
          }
          onClick={() =>
            void run(
              "publish",
              onPublish,
            )
          }
          className={`${buttonBaseClass} bg-[#26221d] text-white hover:opacity-90`}
        >
          <Globe
            size={14}
            className="shrink-0"
          />

          <span className="min-w-0 truncate">
            {action === "publish"
              ? "Publishing..."
              : "Publish Product"}
          </span>
        </button>

        {/* DRAFT */}
        <button
          type="button"
          disabled={
            saving || action !== null
          }
          onClick={() =>
            void run(
              "draft",
              onDraft,
            )
          }
          className={`${buttonBaseClass} border border-[#d6ccb6] bg-[#fffdf8] text-[#2a2520] hover:bg-[#f7f2e7]`}
        >
          <span className="min-w-0 truncate">
            {action === "draft"
              ? "Updating..."
              : "Move to Draft"}
          </span>
        </button>

        {/* UNPUBLISH */}
        {product.status === "active" && (
          <button
            type="button"
            disabled={
              saving || action !== null
            }
            onClick={() =>
              void run(
                "unpublish",
                onUnpublish,
              )
            }
            className={`${buttonBaseClass} border border-[#fdecec] bg-[#fffdf8] text-[#b3261e] hover:bg-[#fdecec]`}
          >
            <EyeOff
              size={14}
              className="shrink-0"
            />

            <span className="min-w-0 truncate">
              {action === "unpublish"
                ? "Unpublishing..."
                : "Unpublish"}
            </span>
          </button>
        )}

        {/* ARCHIVE */}
        {product.status !== "archived" && (
          <button
            type="button"
            disabled={
              saving || action !== null
            }
            onClick={() =>
              void run(
                "archive",
                onArchive,
              )
            }
            className={`${buttonBaseClass} border border-[#fdecec] bg-[#fffdf8] text-[#b3261e] hover:bg-[#fdecec]`}
          >
            <Archive
              size={14}
              className="shrink-0"
            />

            <span className="min-w-0 truncate">
              {action === "archive"
                ? "Archiving..."
                : "Archive"}
            </span>
          </button>
        )}

        {/* DELETE */}
        <button
          type="button"
          disabled={
            saving || action !== null
          }
          onClick={() =>
            setShowDeleteConfirm(true)
          }
          className={`${buttonBaseClass} mt-2 border border-[#b3261e] bg-[#fdecec] text-[#b3261e] hover:bg-[#3d372f]`}
        >
          <Trash2
            size={14}
            className="shrink-0"
          />

          <span className="min-w-0 truncate">
            Delete Product
          </span>
        </button>
      </div>

      {/* DELETE CONFIRMATION */}
      {showDeleteConfirm && (
        <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-[#fdecec] bg-[#fdecec] p-3.5">
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold leading-5 text-[#b3261e]">
              Delete this product?
            </p>

            <p className="mt-1.5 break-words text-xs leading-5 text-[#5f584d]">
              This action permanently deletes the
              product and cannot be undone.
            </p>
          </div>

          <div className="mt-3 grid min-w-0 grid-cols-2 gap-2">
            <button
              type="button"
              disabled={
                saving ||
                action !== null
              }
              onClick={() =>
                setShowDeleteConfirm(false)
              }
              className="min-w-0 rounded-xl border border-[#d6ccb6] bg-[#fffdf8] px-3 py-2 text-xs font-medium text-[#2a2520] transition hover:bg-[#f7f2e7] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={
                saving ||
                action !== null
              }
              onClick={() =>
                void handleDelete()
              }
              className="min-w-0 rounded-xl bg-[#b3261e] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#3d372f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {action === "delete"
                ? "Deleting..."
                : "Yes, Delete"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}