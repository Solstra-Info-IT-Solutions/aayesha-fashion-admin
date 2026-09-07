"use client";

import type {
  CreateSizeInput,
} from "@/types/catalog";

type Props = {
  value: CreateSizeInput;
  onChange: (
    value: CreateSizeInput,
  ) => void;
};

export default function SizeForm({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-5">
      <Input
        label="Code"
        value={value.code}
        onChange={(code) =>
          onChange({
            ...value,
            code: code.toUpperCase(),
          })
        }
        placeholder="M"
      />

      <Input
        label="Label"
        value={value.label}
        onChange={(label) =>
          onChange({
            ...value,
            label,
          })
        }
        placeholder="Medium"
      />

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