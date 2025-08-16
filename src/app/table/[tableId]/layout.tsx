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
    return null;
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