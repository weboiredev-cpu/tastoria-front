"use client";

import { Typography } from "@material-tailwind/react";
import StatsCard from "@/components/stats-card";

const STATS = [
  {
    count: "500+",
    title: "Happy Customers",
  },
  {
    count: "50+",
    title: "Coffee Varieties",
  },
  {
    count: "100+",
    title: "Menu Items",
  },
  {
    count: "5",
    title: "Star Rating",
  },
];

export function OurStats() {
  return (
    <section className="container mx-auto grid gap-10 px-8 py-44 lg:grid-cols-1 lg:gap-20 xl:grid-cols-2 xl:place-items-center">
      <div>
        {/* ✅ Added props to fix build error */}
        <Typography
          variant="h6"
          color="orange"
          className="mb-6 font-medium"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          Our Numbers
        </Typography>
        {/* ✅ Added props to fix build error */}
        <Typography
          className="text-5xl font-bold leading-tight lg:w-3/4"
          color="blue-gray"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          Cafe Highlights
        </Typography>
        {/* ✅ Added props to fix build error */}
        <Typography
          variant="lead"
          className="mt-3 w-full !text-gray-500 lg:w-9/12"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          Join thousands of satisfied customers who have made Tastoria Cafe their
          favorite destination for quality coffee, delicious food, and memorable moments.
        </Typography>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-8 gap-x-28">
          {STATS.map((props, key) => (
            <StatsCard key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurStats;