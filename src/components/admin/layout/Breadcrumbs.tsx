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
      <p className="hidden text-[10px] uppercase tracking-[0.2em] text-[#958781] sm:block">
        Aayesha Fashion
      </p>

      <div className="flex items-center gap-2 sm:mt-0.5">
        <Link
          href="/admin"
          className="hidden text-sm text-[#70635d] hover:text-[#3f2d2a] sm:inline"
        >
          Admin
        </Link>

        <span className="hidden text-[#b9aaa1] sm:inline">/</span>

        <span
          className={`truncate font-serif text-xl text-[#3f2d2a] ${
            deeper ? "hidden sm:inline" : ""
          }`}
        >
          {title}
        </span>

        {deeper ? (
          <span className="truncate font-serif text-xl text-[#3f2d2a] sm:hidden">
            {title}
          </span>
        ) : null}
      </div>
    </div>
  );
}
