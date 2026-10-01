"use client";

import { LogOut, UserCircle } from "lucide-react";
import { useState } from "react";

import { useAdminAuth } from "@/hooks/useAdminAuth";

export function UserMenu() {
  const { user, logout } =
    useAdminAuth();

  const [open, setOpen] =
    useState(false);

  const displayName =
    user?.name ||
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ") ||
    user?.email ||
    "Administrator";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className="flex h-10 items-center gap-2 border border-[#e5e7ec] bg-[#ffffff] px-3 text-sm text-[#0f172a] hover:border-[#b4bac6]"
      >
        <UserCircle
          size={18}
          strokeWidth={1.6}
          className="text-[#5b6270]"
        />

        <span className="hidden max-w-[150px] truncate sm:block">
          {displayName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 border border-[#e5e7ec] bg-[#ffffff] p-2 shadow-lg">
          <div className="border-b border-[#e5e7ec] px-3 py-3">
            <p className="text-sm font-medium text-[#0f172a]">
              {displayName}
            </p>

            <p className="mt-1 truncate text-xs text-[#737a8c]">
              {user?.email}
            </p>

            {user?.adminRole && (
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#737a8c]">
                {user.adminRole.replace(
                  /_/g,
                  " ",
                )}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              void logout()
            }
            className="mt-2 flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[#5b6270] transition hover:bg-[#eef0f4] hover:text-[#0f172a]"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}