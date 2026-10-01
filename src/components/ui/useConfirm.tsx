"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: "danger" | "default";
};

/**
 * Promise-based in-app replacement for window.confirm.
 * Render `dialog` once in the component and `await confirm({...})`.
 */
export function useConfirm(): {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  dialog: ReactNode;
} {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    setOptions(next);

    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = (value: boolean) => {
    resolver.current?.(value);
    resolver.current = null;
    setOptions(null);
  };

  const dialog = (
    <ConfirmDialog
      open={options !== null}
      title={options?.title ?? ""}
      description={options?.description ?? ""}
      confirmLabel={options?.confirmLabel ?? "Confirm"}
      tone={options?.tone ?? "danger"}
      onConfirm={() => settle(true)}
      onCancel={() => settle(false)}
    />
  );

  return { confirm, dialog };
}
