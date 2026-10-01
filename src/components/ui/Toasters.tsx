"use client";

import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";

/**
 * The admin uses both toast libraries (react-hot-toast for sign-in,
 * sonner elsewhere). Neither renders anything unless its Toaster is
 * mounted, so success and error messages were silently dropped.
 */
export function Toasters() {
  return (
    <>
      <HotToaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: 2,
            background: "#0f172a",
            color: "#ffffff",
            fontSize: 13,
          },
        }}
      />

      <SonnerToaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{ style: { borderRadius: 2 } }}
      />
    </>
  );
}
