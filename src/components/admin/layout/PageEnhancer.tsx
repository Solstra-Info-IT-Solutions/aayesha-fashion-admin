"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { navSections } from "@/components/admin/layout/nav-config";

const items = navSections.flatMap((section) => section.items);

function titleFor(pathname: string): string {
  const match = items
    .filter(
      (item) =>
        pathname === item.href ||
        (item.href !== "/admin" && pathname.startsWith(`${item.href}/`)),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];

  return match ? `${match.label} · Aayesha Admin` : "Aayesha Fashion Admin";
}

const CONTROLS = "input, select, textarea";

/** Visible text of the label-like element just before a control, if any. */
function nearbyLabel(control: Element): string {
  let node: Element | null = control;

  for (let depth = 0; depth < 3 && node; depth += 1) {
    const sibling: Element | null = node.previousElementSibling;

    if (sibling) {
      const text = (sibling as HTMLElement).innerText?.trim() ?? "";

      if (text && text.length <= 60 && !sibling.matches(CONTROLS)) {
        return text.replace(/\s*\*\s*$/, "");
      }
    }

    node = node.parentElement;
  }

  return "";
}

/**
 * Admin-wide polish:
 *  - sets a per-section document title (client pages cannot export metadata);
 *  - safety net: gives unlabeled form controls an accessible name from the
 *    nearby label text or placeholder, so screen readers announce them.
 */
export function PageEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    document.title = titleFor(pathname);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;

    const label = () => {
      document
        .querySelectorAll<HTMLElement>(CONTROLS)
        .forEach((control) => {
          const input = control as HTMLInputElement;

          if (
            input.type === "hidden" ||
            control.id ||
            control.getAttribute("aria-label") ||
            control.getAttribute("aria-labelledby") ||
            control.closest("label")
          ) {
            return;
          }

          const text = nearbyLabel(control) || input.placeholder;

          if (text) control.setAttribute("aria-label", text);
        });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(label);
    };

    schedule();

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
