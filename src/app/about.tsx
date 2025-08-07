"use client";

import { Typography } from "@material-tailwind/react";
import { StatsCard } from "@/components";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STATS = [
    { count: "500+", title: "Happy Customers Daily" },
    { count: "50+", title: "Coffee Varieties" },
    { count: "100+", title: "Fresh Menu Items" },
    { count: "5-Star", title: "Average Rating" },
];

export function About() {
  // Refs for scroll-in animation
  const imageRef = useRef(null);
  const storyRef = useRef(null);
  const statsRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const imageInView = useInView(imageRef, { once: true, margin: "-100px" });
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const statsInView = statsRefs.map((ref) => useInView(ref, { once: true, margin: "-100px" }));

  return (
    <section id="about" className="container mx-auto flex flex-col items-center px-4 py-20">
      <Typography variant="h6" className="text-center mb-2 text-orange-500">
        About Tastoria Cafe
      </Typography>
      <Typography variant="h2" className="text-center text-blue-gray-900">
        A Haven for Coffee Lovers
      </Typography>
      <Typography
        variant="lead"
        className="mt-4 lg:max-w-3xl mb-12 w-full text-center font-normal !text-gray-600"
      >
        Welcome to Tastoria Cafe, where every visit is a journey into culinary excellence! 
        Founded in 2023, our mission is to provide a cozy spot for our community to enjoy artisanal coffee, gourmet cuisine, and warm hospitality.
      </Typography>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
        <div className="text-center md:text-left">
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, y: 40 }}
            animate={imageInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            className="relative w-full h-96 mb-8"
          >
            <Image
              src="/image/Tas.jpg"
              alt="Cafe Interior"
              fill
              className="rounded-lg shadow-lg object-cover"
              priority
            />
          </motion.div>
          <motion.div
            ref={storyRef}
            initial={{ opacity: 0, y: 40 }}
            animate={storyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 80 }}
          >
            <Typography variant="h4" color="blue-gray" className="mb-4">Our Story</Typography>
            <Typography className="!text-gray-600">
              From a small dream to a beloved local hub, Tastoria Cafe has grown with the love of our patrons. We believe in quality, community, and the simple joy of a perfect cup of coffee. Our beans are ethically sourced, and our food is made from fresh, local ingredients.
            </Typography>
          </motion.div>
        </div>
        <div>
          <Typography variant="h4" color="blue-gray" className="mb-8 text-center md:text-left">Our Highlights</Typography>
          <div className="grid grid-cols-2 gap-8">
            {STATS.map((props, key) => (
              <motion.div
                key={key}
                ref={statsRefs[key]}
                initial={{ opacity: 0, y: 40 }}
                animate={statsInView[key] ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: key * 0.15, type: "spring", stiffness: 80 }}
                whileHover={{ scale: 1.04 }}
              >
                <StatsCard {...props} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About; 