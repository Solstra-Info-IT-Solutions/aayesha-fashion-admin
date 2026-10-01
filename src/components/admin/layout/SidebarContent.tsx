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
      <Link
        href="/admin"
        onClick={onNavigate}
        className="border-b border-white/10 px-6 py-6"
      >
        <p className="text-[9px] uppercase tracking-[0.3em] text-[#d2bea0]">
          Aayesha Fashion
        </p>

        <p className="mt-1 font-serif text-[28px] leading-none text-white">
          Admin
        </p>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.2em] text-[#958781]">
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

      <div className="border-t border-white/10 px-6 py-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#958781]">
          Store administration
        </p>
      </div>
    </div>
  );
}
