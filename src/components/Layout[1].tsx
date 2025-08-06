"use client";

import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
}

export default Layout; 