"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { titleForPath } from "./nav-config";

export function Breadcrumbs() {
  const pathname = usePathname();
  const title = titleForPath(pathname);
  const deeper = pathname.split("/").filter(Boolean).length > 2;

  return (
    <div className="min-w-0">
      <p className="hidden text-[10px] uppercase tracking-[0.2em] text-[#756d62] sm:block">
        Aayesha Fashion
      </p>

      <div className="flex items-center gap-2 sm:mt-0.5">
        <Link
          href="/admin"
          className="hidden text-sm text-[#5f584d] hover:text-[#2a2520] sm:inline"
        >
          Admin
        </Link>

        <span className="hidden text-[#747b8d] sm:inline">/</span>

        <span
          className={`truncate font-serif text-xl text-[#2a2520] ${
            deeper ? "hidden sm:inline" : ""
          }`}
        >
          {title}
        </span>

        {deeper ? (
          <span className="truncate font-serif text-xl text-[#2a2520] sm:hidden">
            {title}
          </span>
        ) : null}
      </div>
    </div>
  );
}
