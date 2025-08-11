"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className={outfit.className}>{children}</div>
    </ThemeProvider>
  );
}

export default Layout;
