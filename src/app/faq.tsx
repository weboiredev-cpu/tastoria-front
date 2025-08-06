"use client";

import React from "react";
import { Typography, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";

const FAQS = [
  {
    title: "1. What are your opening hours?",
    desc: "We are open daily from 7:00 AM to 10:00 PM. We also offer early bird specials from 7:00 AM to 9:00 AM for our morning customers.",
  },
  
 
  {
    title: "4. Do you have vegetarian and vegan options?",
    desc: "Yes, we have a wide variety of vegetarian and vegan options on our menu. Our kitchen team is happy to accommodate dietary restrictions and can modify many of our dishes to meet your needs.",
  },
  {
    title: "5. Do you host events or private parties?",
    desc: "We do! Tastoria Cafe is perfect for intimate gatherings, business meetings, and special celebrations. We offer catering services and can accommodate groups of various sizes. Contact us for more details about our event packages.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <section id="faq" className="py-8 px-8 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <Typography variant="h1" color="blue-gray" className="mb-4">
            Frequently asked questions
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto mb-24 lg:w-3/5 !text-gray-500"
          >
            Welcome to Tastoria Cafe FAQ section. We&apos;re here to
            address your questions and help you make the most of your cafe experience.
          </Typography>
        </div>

        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {FAQS.map(({ title, desc }, key) => (
            <Accordion
              key={key}
              open={open === key + 1}
              onClick={() => handleOpen(key + 1)}
            >
              <AccordionHeader className="text-left text-gray-900">
                {title}
              </AccordionHeader>
              <AccordionBody>
                <Typography
                  color="blue-gray"
                  className="font-normal text-gray-500"
                >
                  {desc}
                </Typography>
              </AccordionBody>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
