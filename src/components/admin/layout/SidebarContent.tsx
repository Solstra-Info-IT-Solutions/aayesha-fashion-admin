"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarNavItem } from "./SidebarNavItem";
import { isActivePath, navSections } from "./nav-config";

/** Brand + navigation, shared by the desktop sidebar and mobile drawer. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" onClick={onNavigate} className="px-6 pb-5 pt-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#8a6a3b]">
          Aayesha Fashion
        </p>

        <p className="display mt-1 text-[34px] font-semibold leading-none text-[#26221d]">
          Admin
        </p>

        <span className="mt-4 block h-px w-10 bg-[#b08d57]" />
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Admin">
        {navSections.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#756d62]">
              {section.title}
            </p>

            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  {...item}
                  active={isActivePath(item.href, pathname)}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#e6dfcf] px-6 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#756d62]">
          Store administration
        </p>
      </div>
    </div>
  );
}
