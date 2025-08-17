"use client";

import React, { useRef } from "react";
import { Typography, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { motion, useInView } from "framer-motion";

const FAQS = [
  {
    title: "1. What are your opening hours?",
    desc: "We are open daily from 7:00 AM to 10:00 PM. We also offer early bird specials from 7:00 AM to 9:00 AM for our morning customers.",
  },
  {
    title: "2. Do you have vegetarian and vegan options?",
    desc: "Yes, we have a wide variety of vegetarian and vegan options on our menu. Our kitchen team is happy to accommodate dietary restrictions and can modify many of our dishes to meet your needs.",
  },
  {
    title: "3. Do you host events or private parties?",
    desc: "We do! Tastoria Cafe is perfect for intimate gatherings, business meetings, and special celebrations. We offer catering services and can accommodate groups of various sizes. Contact us for more details about our event packages.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  // Refs and inView for each FAQ
  const refs = [useRef(null), useRef(null), useRef(null)];
  const inViews = refs.map((ref) => useInView(ref, { once: true, margin: "-100px" }));

  return (
    <section id="faq" className="py-8 px-8 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center">
          {/* ✅ Added props to fix build error */}
          <Typography
            variant="h1"
            color="blue-gray"
            className="mb-4"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            Frequently asked questions
          </Typography>
          {/* ✅ Added props to fix build error */}
          <Typography
            variant="lead"
            className="mx-auto mb-24 lg:w-3/5 !text-gray-500"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            Welcome to Tastoria Cafe FAQ section. We&apos;re here to
            address your questions and help you make the most of your cafe experience.
          </Typography>
        </div>

        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {FAQS.map(({ title, desc }, key) => (
            <motion.div
              key={key}
              ref={refs[key]}
              initial={{ opacity: 0, y: 40 }}
              animate={inViews[key] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: key * 0.15, type: "spring", stiffness: 80 }}
            >
              {/* ✅ Added props to fix build error */}
              <Accordion
                open={open === key + 1}
                onClick={() => handleOpen(key + 1)}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                <AccordionHeader
                  className="text-left text-gray-900"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                >
                  {title}
                </AccordionHeader>
                <AccordionBody>
                  <Typography
                    color="blue-gray"
                    className="font-normal text-gray-500"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    onResize={undefined}
                    onResizeCapture={undefined}
                  >
                    {desc}
                  </Typography>
                </AccordionBody>
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;