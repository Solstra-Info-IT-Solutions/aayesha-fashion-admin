"use client";

import type {
  AttributeType,
  CreateAttributeInput,
} from "@/types/catalog";

type Props = {
  value: CreateAttributeInput;
  onChange: (
    value: CreateAttributeInput,
  ) => void;
};

const types: AttributeType[] = [
  "text",
  "number",
  "boolean",
  "single_select",
  "multi_select",
];

export default function AttributeForm({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-5">
      <Input
        label="Key"
        value={value.key}
        onChange={(key) =>
          onChange({
            ...value,
            key: key
              .toLowerCase()
              .replace(
                /[^a-z0-9_]/g,
                "",
              ),
          })
        }
        placeholder="fabric"
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
        placeholder="Fabric"
      />

      <div>
        <label className="mb-2 block text-sm font-medium text-neutral-800">
          Type
        </label>

        <select
          value={value.type}
          onChange={(e) =>
            onChange({
              ...value,
              type: e.target
                .value as AttributeType,
            })
          }
          className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
        >
          {types.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type
                .replace(/_/g, " ")
                .replace(
                  /\b\w/g,
                  (char) =>
                    char.toUpperCase(),
                )}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Options"
        value={
          value.options?.join(
            ", ",
          ) ?? ""
        }
        onChange={(options) =>
          onChange({
            ...value,
            options: options
              .split(",")
              .map(
                (option) =>
                  option.trim(),
              )
              .filter(Boolean),
          })
        }
        placeholder="Cotton, Silk, Linen"
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