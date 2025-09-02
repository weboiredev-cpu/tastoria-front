"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Hero from "../../hero";
import About from "../../about";
import Contact from "../../contact";
import Faq from "../../faq";

const VALID_TABLES = Array.from({ length: 30 }, (_, i) => String(i + 1));


export default function TableLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const tableId = params.tableId as string;
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!VALID_TABLES.includes(tableId)) {
      window.location.href = '/';
      return;
    }
  }, [tableId]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-24">
          <div className="animate-pulse space-y-6">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-48 bg-gray-200 rounded" />
              <div className="h-48 bg-gray-200 rounded" />
              <div className="h-48 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showMenu) {
    return children;
  }

  return (
    <>
      <Hero tableId={tableId} onViewMenu={() => setShowMenu(true)} />
      <About />
      <section id="contact" className="scroll-mt-20">
        <Contact />
      </section>
      <Faq />
    </>
  );
} 