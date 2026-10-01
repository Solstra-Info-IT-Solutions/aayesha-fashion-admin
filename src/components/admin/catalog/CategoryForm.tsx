"use client";

import type {
  CreateCategoryInput,
} from "@/types/catalog";

type Props = {
  value: CreateCategoryInput;
  categories: {
    _id: string;
    name: string;
  }[];
  editingId?: string;
  onChange: (
    value: CreateCategoryInput,
  ) => void;
};

export default function CategoryForm({
  value,
  categories,
  editingId,
  onChange,
}: Props) {
  const update = (
    key: keyof CreateCategoryInput,
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
        <div>
          <label className="mb-2 block text-sm font-medium text-[#2a2520]">
            Name *
          </label>

          <input
            value={value.name}
            onChange={(e) =>
              update(
                "name",
                e.target.value,
              )
            }
            placeholder="Sarees"
            className="w-full rounded-lg border border-[#d6ccb6] px-3.5 py-2.5 text-sm outline-none focus:border-[#756d62]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#2a2520]">
            Slug *
          </label>

          <input
            value={value.slug}
            onChange={(e) =>
              update(
                "slug",
                e.target.value
                  .toLowerCase(),
              )
            }
            placeholder="sarees"
            className="w-full rounded-lg border border-[#d6ccb6] px-3.5 py-2.5 text-sm outline-none focus:border-[#756d62]"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#2a2520]">
          Description
        </label>

        <textarea
          rows={3}
          value={
            value.description ?? ""
          }
          onChange={(e) =>
            update(
              "description",
              e.target.value,
            )
          }
          className="w-full resize-y rounded-lg border border-[#d6ccb6] px-3.5 py-2.5 text-sm outline-none focus:border-[#756d62]"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#2a2520]">
            Parent Category
          </label>

          <select
            value={
              value.parentId ?? ""
            }
            onChange={(e) =>
              update(
                "parentId",
                e.target.value ||
                  null,
              )
            }
            className="w-full rounded-lg border border-[#d6ccb6] bg-[#fffdf8] px-3.5 py-2.5 text-sm outline-none focus:border-[#756d62]"
          >
            <option value="">
              No Parent
            </option>

            {categories
              .filter(
                (category) =>
                  category._id !==
                  editingId,
              )
              .map((category) => (
                <option
                  key={
                    category._id
                  }
                  value={
                    category._id
                  }
                >
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#2a2520]">
            Sort Order
          </label>

          <input
            type="number"
            value={
              value.sortOrder ?? 0
            }
            onChange={(e) =>
              update(
                "sortOrder",
                Number(
                  e.target.value,
                ) || 0,
              )
            }
            className="w-full rounded-lg border border-[#d6ccb6] px-3.5 py-2.5 text-sm outline-none focus:border-[#756d62]"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#2a2520]">
          Image URL
        </label>

        <input
          value={value.image ?? ""}
          onChange={(e) =>
            update(
              "image",
              e.target.value,
            )
          }
          placeholder="https://..."
          className="w-full rounded-lg border border-[#d6ccb6] px-3.5 py-2.5 text-sm outline-none focus:border-[#756d62]"
        />
      </div>

      <div className="border-t border-[#d6ccb6] pt-5">
        <p className="text-sm font-semibold text-[#2a2520]">
          SEO
        </p>

        <div className="mt-4 space-y-4">
          <input
            value={
              value.seoTitle ?? ""
            }
            onChange={(e) =>
              update(
                "seoTitle",
                e.target.value,
              )
            }
            placeholder="SEO Title"
            className="w-full rounded-lg border border-[#d6ccb6] px-3.5 py-2.5 text-sm outline-none focus:border-[#756d62]"
          />

          <textarea
            rows={3}
            value={
              value.seoDescription ??
              ""
            }
            onChange={(e) =>
              update(
                "seoDescription",
                e.target.value,
              )
            }
            placeholder="SEO Description"
            className="w-full rounded-lg border border-[#d6ccb6] px-3.5 py-2.5 text-sm outline-none focus:border-[#756d62]"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-[#d6ccb6] px-4 py-3">
        <input
          type="checkbox"
          checked={
            value.isActive ?? true
          }
          onChange={(e) =>
            update(
              "isActive",
              e.target.checked,
            )
          }
          className="h-4 w-4 rounded"
        />

        <span className="text-sm font-medium text-[#2a2520]">
          Category is active
        </span>
      </label>
    </div>
  );
}