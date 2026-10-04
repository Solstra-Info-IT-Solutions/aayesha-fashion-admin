"use client";

import type {
  CreateTagInput,
} from "@/types/catalog";

type Props = {
  value: CreateTagInput;
  onChange: (
    value: CreateTagInput,
  ) => void;
};

export default function TagForm({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-5">
      <Input
        label="Name"
        value={value.name}
        onChange={(name) =>
          onChange({
            ...value,
            name,
          })
        }
      />

      <Input
        label="Slug"
        value={value.slug}
        onChange={(slug) =>
          onChange({
            ...value,
            slug: slug.toLowerCase(),
          })
        }
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-[#f8f3f1]">
          Description
        </label>

        <textarea
          rows={3}
          value={
            value.description ?? ""
          }
          onChange={(e) =>
            onChange({
              ...value,
              description:
                e.target.value,
            })
          }
          className="w-full resize-y rounded-lg border border-[#3a352f] px-3.5 py-2.5 text-sm outline-none focus:border-[#9a9185]"
        />
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-[#3a352f] px-4 py-3">
        <input
          type="checkbox"
          checked={
            value.isActive ?? true
          }
          onChange={(e) =>
            onChange({
              ...value,
              isActive:
                e.target.checked,
            })
          }
          className="h-4 w-4"
        />

        <span className="text-sm font-medium text-[#f8f3f1]">
          Active
        </span>
      </label>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#f8f3f1]">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border border-[#3a352f] px-3.5 py-2.5 text-sm outline-none focus:border-[#9a9185]"
      />
    </div>
  );
}