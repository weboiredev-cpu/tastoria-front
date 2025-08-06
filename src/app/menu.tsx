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
    name: "Sarah Johnson",
    position: "Head Barista",
    panel: "Coffee Menu",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop",
  },
  {
    title: "Fresh Pastries & Desserts",
    des: "Indulge in our selection of freshly baked pastries, cakes, and desserts made daily in our kitchen. Each bite is a celebration of flavor and craftsmanship.",
    name: "Michael Chen",
    position: "Pastry Chef",
    panel: "Bakery",
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1964&auto=format&fit=crop",
  },
  {
    title: "Seasonal Specials",
    des: "Experience our rotating menu of seasonal specialties that showcase the best ingredients of each season, prepared with creativity and care by our culinary team.",
    name: "Emma Rodriguez",
    position: "Executive Chef",
    panel: "Seasonal Menu",
    img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1998&auto=format&fit=crop",
  },
];

export function Menu() {
  return (
    <section id="menu" className="py-8 px-8 lg:py-20">
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

export default Menu; 