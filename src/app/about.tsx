"use client";

import { Typography } from "@material-tailwind/react";
import { StatsCard } from "@/components";
import Image from "next/image";

const STATS = [
    { count: "500+", title: "Happy Customers Daily" },
    { count: "50+", title: "Coffee Varieties" },
    { count: "100+", title: "Fresh Menu Items" },
    { count: "5-Star", title: "Average Rating" },
];

export function About() {
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
            <div className="relative w-full h-96 mb-8">
                <Image
                    src="/image/Tas.jpg"
                    alt="Cafe Interior"
                    fill
                    className="rounded-lg shadow-lg object-cover"
                    priority
                />
            </div>
            
            <Typography variant="h4" color="blue-gray" className="mb-4">Our Story</Typography>
            <Typography className="!text-gray-600">
                From a small dream to a beloved local hub, Tastoria Cafe has grown with the love of our patrons. We believe in quality, community, and the simple joy of a perfect cup of coffee. Our beans are ethically sourced, and our food is made from fresh, local ingredients.
            </Typography>
        </div>
        <div>
            <Typography variant="h4" color="blue-gray" className="mb-8 text-center md:text-left">Our Highlights</Typography>
            <div className="grid grid-cols-2 gap-8">
              {STATS.map((props, key) => (
                <StatsCard key={key} {...props} />
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}

export default About; 