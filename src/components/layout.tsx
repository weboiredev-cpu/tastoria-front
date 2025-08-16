"use client";

import React from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={outfit.className}>{children}</div>
  );
}

export default Layout;
