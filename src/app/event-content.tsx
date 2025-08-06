"use client";

import {
  Tab,
  Tabs,
  TabsHeader,
} from "@material-tailwind/react";

import EventContentCard from "@/components/event-content-card";

const MENU_HIGHLIGHTS = [
  {
    title: "Signature Coffee Blends",
    des: "Discover our carefully crafted coffee blends, each with its own unique character and story. From light and fruity to dark and bold, our baristas will guide you to your perfect cup.",
    panel: "Coffee Menu",
    img: "/image/coffee-specialist.jpg",
  },
  {
    title: "Fresh Pastries & Desserts",
    des: "Indulge in our selection of freshly baked pastries, cakes, and desserts made daily in our kitchen. Each bite is a celebration of flavor and craftsmanship.",
    
    panel: "Bakery",
    img: "/image/pastry-chef.jpg",
  },
  {
    title: "Seasonal Specials",
    des: "Experience our rotating menu of seasonal specialties that showcase the best ingredients of each season, prepared with creativity and care by our culinary team.",
    
    panel: "Seasonal Menu",
    img: "/image/chef.jpg",
  },
];

export function EventContent() {
  return (
    <section className="py-8 px-8 lg:py-20">
      {/*<Tabs value="Coffee" className="mb-8">
        <div className="w-full flex mb-8 flex-col items-center">
          <TabsHeader className="h-12 w-72 md:w-96">
            <Tab value="Coffee" className="font-medium">
              Coffee
            </Tab>
            <Tab value="Food" className="font-medium">
              Food
            </Tab>
            <Tab value="Desserts" className="font-medium">
              Desserts
            </Tab>
          </TabsHeader>
        </div>
      </Tabs>*/}
      <div className="mx-auto container">
        {MENU_HIGHLIGHTS.map((props, idx) => (
          <EventContentCard key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}

export default EventContent;
