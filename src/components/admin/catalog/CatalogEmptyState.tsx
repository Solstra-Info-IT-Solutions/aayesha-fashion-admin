"use client";

import {
  Plus,
} from "lucide-react";

type Props = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export default function CatalogEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <Plus className="h-5 w-5" />
      </div>

      <p className="mt-4 text-sm font-semibold text-neutral-800">
        {title}
      </p>

      <p className="mt-1 text-sm text-neutral-500">
        {description}
      </p>

      <button
        type="button"
        onClick={onAction}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        <Plus className="h-4 w-4" />
        {actionLabel}
      </button>
    </div>
  );
}