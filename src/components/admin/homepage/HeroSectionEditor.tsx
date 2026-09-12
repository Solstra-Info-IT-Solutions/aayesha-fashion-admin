"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  HomepageHero,
  HomepageHeroSlide,
} from "@/types/homepage";

import { HeroSlideForm } from "./HeroSlideForm";

interface HeroSectionEditorProps {
  data: HomepageHero;
  onSave: (data: HomepageHero) => Promise<void>;
}

export function HeroSectionEditor({
  data,
  onSave,
}: HeroSectionEditorProps) {
  const [hero, setHero] = useState<HomepageHero>(data);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setHero(data);
  }, [data]);

  function updateHeroEnabled(enabled: boolean) {
    setHero((current) => ({
      ...current,
      enabled,
    }));
  }

  function handleAddSlide(slide: HomepageHeroSlide) {
  setHero((current) => {
    const slides = [
      ...current.slides,
      {
        ...slide,
        sortOrder: current.slides.length + 1,
      },
    ];

    return {
      ...current,
      slides: slides.map((item, index) => ({
        ...item,
        sortOrder: index + 1,
      })),
    };
  });

  setShowForm(false);
}

  function handleUpdateSlide(slide: HomepageHeroSlide) {
  setHero((current) => {
    const slides = current.slides.map((item) =>
      item.id === slide.id
        ? {
            ...slide,
            sortOrder: item.sortOrder,
          }
        : item,
    );

    return {
      ...current,
      slides: slides.map((item, index) => ({
        ...item,
        sortOrder: index + 1,
      })),
    };
  });

  setEditingSlideId(null);
}

  function handleDeleteSlide(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hero slide?",
    );

    if (!confirmed) {
      return;
    }

    setHero((current) => ({
      ...current,
      slides: current.slides.filter((slide) => slide.id !== id),
    }));
  }

  function toggleSlide(id: string) {
    setHero((current) => ({
      ...current,
      slides: current.slides.map((slide) =>
        slide.id === id
          ? {
              ...slide,
              isActive: !slide.isActive,
            }
          : slide,
      ),
    }));
  }

  function moveSlide(id: string, direction: "up" | "down") {
    setHero((current) => {
      const slides = [...current.slides];
      const index = slides.findIndex(
        (slide) => slide.id === id,
      );

      if (index === -1) {
        return current;
      }

      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= slides.length
      ) {
        return current;
      }

      const [movedSlide] = slides.splice(index, 1);

      slides.splice(targetIndex, 0, movedSlide);

      return {
        ...current,
        slides: slides.map((slide, slideIndex) => ({
          ...slide,
          sortOrder: slideIndex + 1,
        })),
      };
    });
  }

  async function handleSave() {
    setSaving(true);

    try {
      const normalized: HomepageHero = {
        ...hero,
        slides: hero.slides.map((slide, index) => ({
          ...slide,
          sortOrder: index + 1,
        })),
      };

      await onSave(normalized);
      setHero(normalized);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Status */}
      <section className="border border-[#e3ded8] bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-[#e8e3de] px-6 py-5">
          <div>
            <h3 className="text-sm font-medium text-[#292624]">
              Hero Section
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#77736e]">
              Control the main visual section displayed at the
              top of the homepage.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateHeroEnabled(!hero.enabled)
            }
            className={[
              "inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition",
              hero.enabled
                ? "bg-[#9f1239] text-white"
                : "border border-[#d6d0ca] bg-white text-[#77736e]",
            ].join(" ")}
          >
            {hero.enabled ? (
              <>
                <Eye size={14} />
                Enabled
              </>
            ) : (
              <>
                <EyeOff size={14} />
                Disabled
              </>
            )}
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center justify-between gap-4 rounded border border-[#e7e1db] bg-[#faf9f7] px-4 py-3">
            <div>
              <p className="text-xs font-medium text-[#393532]">
                Homepage hero visibility
              </p>

              <p className="mt-1 text-xs text-[#8b847d]">
                {hero.enabled
                  ? "The hero section is currently visible."
                  : "The hero section is currently hidden."}
              </p>
            </div>

            <span
              className={[
                "text-[10px] font-medium uppercase tracking-[0.15em]",
                hero.enabled
                  ? "text-[#9f1239]"
                  : "text-[#8b847d]",
              ].join(" ")}
            >
              {hero.enabled ? "Live" : "Hidden"}
            </span>
          </div>
        </div>
      </section>

      {/* Slides */}
      <section className="border border-[#e3ded8] bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-[#e8e3de] px-6 py-5">
          <div>
            <h3 className="text-sm font-medium text-[#292624]">
              Hero Slides
            </h3>

            <p className="mt-1 text-xs text-[#77736e]">
              Manage the slides shown in the homepage carousel.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingSlideId(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 bg-[#9f1239] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[#881337]"
          >
            <Plus size={15} />
            Add Slide
          </button>
        </div>

        <div className="p-6">
          {showForm && (
            <div className="mb-6 border border-[#e3ded8] bg-[#faf9f7] p-6">
              <HeroSlideForm
                mode="create"
                onCancel={() => setShowForm(false)}
                onSubmit={handleAddSlide}
              />
            </div>
          )}

          {hero.slides.length === 0 ? (
            <div className="border border-dashed border-[#d8d1ca] px-6 py-12 text-center">
              <p className="text-sm text-[#55504b]">
                No hero slides configured.
              </p>

              <p className="mt-1 text-xs text-[#8b847d]">
                Add your first hero slide to display the
                homepage hero.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {hero.slides
                .slice()
                .sort(
                  (a, b) =>
                    a.sortOrder - b.sortOrder,
                )
                .map((slide, index) => {
                  const editing =
                    editingSlideId === slide.id;

                  return (
                    <div
                      key={slide.id}
                      className="border border-[#e3ded8] bg-white"
                    >
                      {editing ? (
                        <div className="bg-[#faf9f7] p-6">
                          <HeroSlideForm
                            mode="edit"
                            initialData={slide}
                            onCancel={() =>
                              setEditingSlideId(null)
                            }
                            onSubmit={
                              handleUpdateSlide
                            }
                          />
                        </div>
                      ) : (
                        <HeroSlideRow
                          slide={slide}
                          index={index}
                          total={hero.slides.length}
                          onEdit={() =>
                            setEditingSlideId(
                              slide.id,
                            )
                          }
                          onDelete={() =>
                            handleDeleteSlide(
                              slide.id,
                            )
                          }
                          onToggle={() =>
                            toggleSlide(
                              slide.id,
                            )
                          }
                          onMoveUp={() =>
                            moveSlide(
                              slide.id,
                              "up",
                            )
                          }
                          onMoveDown={() =>
                            moveSlide(
                              slide.id,
                              "down",
                            )
                          }
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      {/* Save */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 border border-[#d8d1ca] bg-white/95 px-5 py-4 shadow-sm backdrop-blur">
        <div>
          <p className="text-xs font-medium text-[#393532]">
            Hero changes
          </p>

          <p className="mt-1 text-[11px] text-[#8b847d]">
            Save to publish the updated hero configuration.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#9f1239] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-white transition hover:bg-[#881337] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check size={15} />

          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

interface HeroSlideRowProps {
  slide: HomepageHeroSlide;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function HeroSlideRow({
  slide,
  index,
  total,
  onEdit,
  onDelete,
  onToggle,
  onMoveUp,
  onMoveDown,
}: HeroSlideRowProps) {
  return (
    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">
      {/* Image */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden bg-[#eeeae5] lg:w-52">
        {slide.image ? (
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#8b847d]">
            No image
          </div>
        )}

        <div className="absolute left-2 top-2 bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
          #{slide.sortOrder}
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={[
              "inline-flex px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em]",
              slide.isActive
                ? "bg-[#fce7f3] text-[#9f1239]"
                : "bg-[#f1efed] text-[#77736e]",
            ].join(" ")}
          >
            {slide.isActive ? "Active" : "Inactive"}
          </span>

          {slide.eyebrow && (
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#9a928b]">
              {slide.eyebrow}
            </span>
          )}
        </div>

        <h4 className="mt-2 font-serif text-xl text-[#292624]">
          {slide.title}
        </h4>

        {slide.description && (
          <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-5 text-[#77736e]">
            {slide.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[10px] text-[#8b847d]">
          <span>
            CTA: {slide.buttonLabel || "—"}
          </span>

          <span>
            Link: {slide.href || "—"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-wrap items-center gap-1 lg:flex-col">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            title="Move up"
            className="flex h-8 w-8 items-center justify-center border border-[#ddd7d1] text-[#77736e] hover:text-[#9f1239] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronUp size={15} />
          </button>

          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            title="Move down"
            className="flex h-8 w-8 items-center justify-center border-y border-r border-[#ddd7d1] text-[#77736e] hover:text-[#9f1239] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronDown size={15} />
          </button>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={onToggle}
            title={slide.isActive ? "Deactivate" : "Activate"}
            className="flex h-8 w-8 items-center justify-center border border-[#ddd7d1] text-[#77736e] hover:text-[#9f1239]"
          >
            {slide.isActive ? (
              <Eye size={14} />
            ) : (
              <EyeOff size={14} />
            )}
          </button>

          <button
            type="button"
            onClick={onEdit}
            title="Edit"
            className="flex h-8 w-8 items-center justify-center border-y border-r border-[#ddd7d1] text-[#77736e] hover:text-[#9f1239]"
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            className="flex h-8 w-8 items-center justify-center border-y border-r border-[#ddd7d1] text-[#77736e] hover:text-red-700"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}