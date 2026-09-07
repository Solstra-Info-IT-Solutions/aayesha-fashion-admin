"use client";

import type {
  CreateColorInput,
} from "@/types/catalog";

type Props = {
  value: CreateColorInput;
  onChange: (
    value: CreateColorInput,
  ) => void;
};

export default function ColorForm({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Hex Color"
          value={value.hex ?? ""}
          onChange={(hex) =>
            onChange({
              ...value,
              hex: hex || null,
            })
          }
          placeholder="#EFA7AE"
        />

        <Input
          label="Swatch Image URL"
          value={
            value.swatchImage ?? ""
          }
          onChange={(swatchImage) =>
            onChange({
              ...value,
              swatchImage,
            })
          }
        />
      </div>

      <Input
        label="Sort Order"
        type="number"
        value={String(
          value.sortOrder ?? 0,
        )}
        onChange={(sortOrder) =>
          onChange({
            ...value,
            sortOrder:
              Number(
                sortOrder,
              ) || 0,
          })
        }
      />

      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4">
        <span
          className="h-10 w-10 rounded-full border border-neutral-200"
          style={{
            backgroundColor:
              value.hex ||
              "#ffffff",
          }}
        />

        <div>
          <p className="text-sm font-medium text-neutral-800">
            Color Preview
          </p>

          <p className="text-xs text-neutral-500">
            {value.hex ||
              "No hex value"}
          </p>
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3">
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

        <span className="text-sm font-medium text-neutral-800">
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
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
      />
    </div>
  );
}