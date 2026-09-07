"use client";

import type {
  CreateCollectionInput,
} from "@/types/catalog";

type Props = {
  value: CreateCollectionInput;
  onChange: (
    value: CreateCollectionInput,
  ) => void;
};

export default function CollectionForm({
  value,
  onChange,
}: Props) {
  const update = (
    key: keyof CreateCollectionInput,
    fieldValue:
      | string
      | number
      | boolean
      | null,
  ) => {
    onChange({
      ...value,
      [key]: fieldValue,
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Name"
          value={value.name}
          onChange={(v) =>
            update("name", v)
          }
        />

        <Input
          label="Slug"
          value={value.slug}
          onChange={(v) =>
            update(
              "slug",
              v.toLowerCase(),
            )
          }
        />
      </div>

      <TextArea
        label="Description"
        value={
          value.description ?? ""
        }
        onChange={(v) =>
          update(
            "description",
            v,
          )
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Image URL"
          value={value.image ?? ""}
          onChange={(v) =>
            update("image", v)
          }
        />

        <Input
          label="Banner Image URL"
          value={
            value.bannerImage ?? ""
          }
          onChange={(v) =>
            update(
              "bannerImage",
              v,
            )
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Sort Order"
          type="number"
          value={String(
            value.sortOrder ?? 0,
          )}
          onChange={(v) =>
            update(
              "sortOrder",
              Number(v) || 0,
            )
          }
        />

        <label className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3">
          <input
            type="checkbox"
            checked={
              value.isFeatured ??
              false
            }
            onChange={(e) =>
              update(
                "isFeatured",
                e.target.checked,
              )
            }
            className="h-4 w-4"
          />

          <span className="text-sm font-medium text-neutral-800">
            Featured Collection
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Starts At"
          type="datetime-local"
          value={value.startsAt ?? ""}
          onChange={(v) =>
            update(
              "startsAt",
              v
                ? new Date(
                    v,
                  ).toISOString()
                : null,
            )
          }
        />

        <Input
          label="Ends At"
          type="datetime-local"
          value={value.endsAt ?? ""}
          onChange={(v) =>
            update(
              "endsAt",
              v
                ? new Date(
                    v,
                  ).toISOString()
                : null,
            )
          }
        />
      </div>

      <Input
        label="SEO Title"
        value={
          value.seoTitle ?? ""
        }
        onChange={(v) =>
          update(
            "seoTitle",
            v,
          )
        }
      />

      <TextArea
        label="SEO Description"
        value={
          value.seoDescription ??
          ""
        }
        onChange={(v) =>
          update(
            "seoDescription",
            v,
          )
        }
      />

      <Active
        checked={
          value.isActive ?? true
        }
        onChange={(v) =>
          update(
            "isActive",
            v,
          )
        }
      />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
      />
    </div>
  );
}

function TextArea({
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
      <label className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </label>

      <textarea
        rows={3}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full resize-y rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-neutral-400"
      />
    </div>
  );
}

function Active({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(
            e.target.checked,
          )
        }
        className="h-4 w-4"
      />

      <span className="text-sm font-medium text-neutral-800">
        Active
      </span>
    </label>
  );
}