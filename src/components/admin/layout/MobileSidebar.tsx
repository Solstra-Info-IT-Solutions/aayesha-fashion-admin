"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { SidebarContent } from "./SidebarContent";

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#3f2d2a]/50"
        aria-label="Close navigation"
      />

      <aside className="relative h-full w-[290px] max-w-[85vw] bg-[#3f2d2a] text-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-4 z-10 inline-flex h-9 w-9 items-center justify-center text-[#d8cec5] hover:text-white"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>

        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
