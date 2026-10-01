"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { recordNavigation } from "@/lib/nav-history";

/** Records each in-app page so Back controls can avoid growing the history stack. */
export function NavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) recordNavigation(pathname);
  }, [pathname]);

  return null;
}
