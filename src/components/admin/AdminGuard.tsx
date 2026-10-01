"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAdminAuth } from "@/hooks/useAdminAuth";

type AdminGuardProps = {
  children: ReactNode;
};

export function AdminGuard({
  children,
}: AdminGuardProps) {
  const router = useRouter();

  const {
    isAuthenticated,
    isInitialized,
    isLoading,
    initializeAuth,
  } = useAdminAuth();

  useEffect(() => {
    if (!isInitialized) {
      void initializeAuth();
    }
  }, [
    isInitialized,
    initializeAuth,
  ]);

  useEffect(() => {
    if (
      isInitialized &&
      !isLoading &&
      !isAuthenticated
    ) {
      router.replace("/login");
    }
  }, [
    isInitialized,
    isLoading,
    isAuthenticated,
    router,
  ]);

  if (
    !isInitialized ||
    isLoading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f3ed]">
        <Loader2
          size={24}
          className="animate-spin text-[#3f2d2a]"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}