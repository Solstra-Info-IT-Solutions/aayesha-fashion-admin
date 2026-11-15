import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Toasters } from "@/components/ui/Toasters";

import "./globals.css";

export const metadata: Metadata = {
  title: "Aayesha Fashion Admin",
  description: "Aayesha Fashion administration panel",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {children}
        <Toasters />
      </body>
    </html>
  );
}
