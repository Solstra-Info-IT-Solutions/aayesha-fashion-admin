"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { MobileSidebar } from "./MobileSidebar";
import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";
import { Breadcrumbs } from "./Breadcrumbs";

export function AdminHeader() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#2e2a26] bg-[#111111]/95 backdrop-blur">
        <div className="flex h-[72px] items-center justify-between px-5 sm:px-7 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(true)
              }
              className="inline-flex h-10 w-10 items-center justify-center border border-[#2e2a26] bg-[#1a1816] text-[#f8f3f1] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </button>

            <Breadcrumbs />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </header>

      <MobileSidebar
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
      />
    </>
  );
}