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
      <header className="sticky top-0 z-30 border-b border-[#e7e2dd] bg-[#fcfbf9]/95 backdrop-blur">
        <div className="flex h-[72px] items-center justify-between px-5 sm:px-7 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(true)
              }
              className="inline-flex h-10 w-10 items-center justify-center border border-[#e7e2dd] bg-white text-[#292c2c] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </button>

            <Breadcrumbs />
          </div>

          <div className="flex items-center gap-2">
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