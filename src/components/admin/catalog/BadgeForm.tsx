"use client";

import type {
  BadgeTone,
  CreateBadgeInput,
} from "@/types/catalog";

type Props = {
  value: CreateBadgeInput;
  onChange: (
    value: CreateBadgeInput,
  ) => void;
};

const tones: BadgeTone[] = [
  "neutral",
  "rose",
  "dark",
  "success",
  "warning",
  "danger",
];

export default function BadgeForm({
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

      <Input
        label="Label"
        value={value.label}
        onChange={(label) =>
          onChange({
            ...value,
            label,
          })
        }
        placeholder="Bestseller"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-800">
            Tone
          </label>

          <select
            value={
              value.tone ?? "neutral"
            }
            onChange={(e) =>
              onChange({
                ...value,
                tone: e.target
                  .value as BadgeTone,
              })
            }
            className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
          >
            {tones.map((tone) => (
              <option
                key={tone}
                value={tone}
              >
                {tone
                  .charAt(0)
                  .toUpperCase() +
                  tone.slice(1)}
              </option>
            ))}
          </select>
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