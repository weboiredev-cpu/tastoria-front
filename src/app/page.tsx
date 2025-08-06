"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import About from "./about";
import Faq from "./faq";
import Contact from "./contact";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const sectionVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  }
};

export default function Portfolio() {
  const params = useParams();
  const tableId = params?.tableId as string | undefined;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Navbar />
      <motion.div variants={sectionVariants}>
        <Hero tableId={tableId} />
      </motion.div>
      <motion.div 
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <About />
      </motion.div>
      <motion.section 
        id="contact" 
        className="scroll-mt-20"
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <Contact />
      </motion.section>
      <motion.div 
        variants={sectionVariants}
        viewport={{ once: true }}
      >
        <Faq />
      </motion.div>
    </motion.div>
  );
}
