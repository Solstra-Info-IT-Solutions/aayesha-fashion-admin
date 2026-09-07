"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Loader2,
} from "lucide-react";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({
  children,
}: AdminGuardProps) {
  const router =
    useRouter();

  const {
    isAuthenticated,
    isInitialized,
    isLoading,
    initializeAuth,
  } =
    useAdminAuth();

  useEffect(() => {
    void initializeAuth();
  }, [
    initializeAuth,
  ]);

  useEffect(() => {
    if (
      isInitialized &&
      !isAuthenticated
    ) {
      router.replace(
        "/login",
      );
    }
  }, [
    isInitialized,
    isAuthenticated,
    router,
  ]);

  if (
    !isInitialized ||
    isLoading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfbf9]">
        <Loader2
          size={24}
          className="animate-spin text-[#292c2c]"
        />
      </div>
    );
  }

  if (
    !isAuthenticated
  ) {
    return null;
  }

  return children;
}