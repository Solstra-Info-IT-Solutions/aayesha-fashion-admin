"use client";

import {
  useState,
} from "react";

import {
  Archive,
  EyeOff,
  Globe,
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
}

export default function ProductPublishSection({
  product,
  saving = false,
  onPublish,
  onDraft,
  onArchive,
  onUnpublish,
}: ProductPublishSectionProps) {
  const [
    action,
    setAction,
  ] = useState<
    string | null
  >(null);

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

  return (
    <section className="rounded-2xl border border-[#e7e2dd] bg-white p-5">
      <h2 className="text-base font-semibold text-[#171717]">
        Publish
      </h2>

      <p className="mt-1 text-sm text-[#6f706f]">
        Control storefront availability and
        product lifecycle.
      </p>

      <div className="mt-5 rounded-xl bg-[#fcfbf9] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#6f706f]">
            Current Status
          </span>

          <span className="rounded-full bg-[#171717] px-3 py-1 text-xs font-medium capitalize text-white">
            {
              product.status
            }
          </span>
        </div>

        {product.publishedAt && (
          <p className="mt-3 text-xs text-[#969696]">
            Published{" "}
            {new Date(
              product.publishedAt,
            ).toLocaleString(
              "en-IN",
            )}
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          disabled={
            saving ||
            action !== null
          }
          onClick={() =>
            void run(
              "publish",
              onPublish,
            )
          }
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#171717] text-sm font-medium text-white disabled:opacity-50"
        >
          <Globe size={15} />
          {action ===
          "publish"
            ? "Publishing..."
            : "Publish Product"}
        </button>

        <button
          type="button"
          disabled={
            saving ||
            action !== null
          }
          onClick={() =>
            void run(
              "draft",
              onDraft,
            )
          }
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#d8d1ca] text-sm font-medium text-[#292c2c] disabled:opacity-50"
        >
          {action ===
          "draft"
            ? "Updating..."
            : "Move to Draft"}
        </button>

        {product.status ===
          "active" && (
          <button
            type="button"
            disabled={
              saving ||
              action !== null
            }
            onClick={() =>
              void run(
                "unpublish",
                onUnpublish,
              )
            }
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#efdede] text-sm font-medium text-[#a33a3a] disabled:opacity-50"
          >
            <EyeOff
              size={15}
            />
            Unpublish
          </button>
        )}

        {product.status !==
          "archived" && (
          <button
            type="button"
            disabled={
              saving ||
              action !== null
            }
            onClick={() =>
              void run(
                "archive",
                onArchive,
              )
            }
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#efdede] text-sm font-medium text-[#a33a3a] disabled:opacity-50"
          >
            <Archive
              size={15}
            />
            Archive
          </button>
        )}
      </div>
    </section>
  );
}