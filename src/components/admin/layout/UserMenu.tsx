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
        className="flex h-10 items-center gap-2 border border-[#e6dfcf] bg-[#fffdf8] px-3 text-sm text-[#2a2520] hover:border-[#bdb199]"
      >
        <UserCircle
          size={18}
          strokeWidth={1.6}
          className="text-[#5f584d]"
        />

        <span className="hidden max-w-[150px] truncate sm:block">
          {displayName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 border border-[#e6dfcf] bg-[#fffdf8] p-2 shadow-lg">
          <div className="border-b border-[#e6dfcf] px-3 py-3">
            <p className="text-sm font-medium text-[#2a2520]">
              {displayName}
            </p>

            <p className="mt-1 truncate text-xs text-[#756d62]">
              {user?.email}
            </p>

            {user?.adminRole && (
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#756d62]">
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
            className="mt-2 flex w-full items-center gap-3 px-3 py-2.5 text-sm text-[#5f584d] transition hover:bg-[#efe8d8] hover:text-[#2a2520]"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}