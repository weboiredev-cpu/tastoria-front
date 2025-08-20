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
      <br></br>
      <section
        className="relative min-h-screen flex flex-col justify-center items-center bg-black"
        style={{
          backgroundImage: "url('/image/newCafe.webp')", // Change to your hero image path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        
        }}
      >
        <div className="absolute inset-0 bg-black/5" /> {/* Overlay for readability */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 py-32">
          {/*<h2 className="text-2xl md:text-3xl font-semibold text-white mb-4 text-center">
            Open Daily 7AM - 10PM @ Parbhani
          </h2>
          */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 text-center">
            Tastoria Cafe: Where Every Sip <br /> Tells a Story
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-8 text-center max-w-2xl">
            Experience the perfect blend of artisanal coffee, gourmet cuisine, and warm hospitality in our cozy Tastoria Cafe.
          </p>
          <a
            href="/menu-page"
            className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
          >
            VIEW MENU
          </a>
        </div>
      </section>
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
