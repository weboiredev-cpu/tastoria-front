"use client";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { MapPinIcon, PhoneIcon, ClockIcon } from "@heroicons/react/24/solid";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const contactData = [
  {
    icon: MapPinIcon,
    title: "Our Address",
    value: "Parbhani 431401",
  },
  {
    icon: PhoneIcon,
    title: "Phone Number",
    value: "+91 8055221419",
  },
  {
    icon: ClockIcon,
    title: "Opening Hours",
    value: "Mon - Sun: 7:00 AM - 10:00 PM",
  },
];

export function Contact() {
  // Create refs for each card
  const refs = [useRef(null), useRef(null), useRef(null)];
  const inViews = refs.map((ref) => useInView(ref, { once: true, margin: "-100px" }));

  return (
    <section id="contact" className="py-20 px-8">
      <div className="container mx-auto text-center">
        <Typography variant="h2" color="blue-gray" className="mb-4">
          Contact & Location
        </Typography>
        <Typography variant="lead" className="mx-auto lg:w-3/5 !text-gray-500 mb-12">
          We'd love to hear from you! Visit us, give us a call, or drop us a line. We're here to make your day a little more delicious.
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {contactData.map(({ icon: Icon, title, value }, idx) => (
            <motion.div
              key={title}
              ref={refs[idx]}
              initial={{ opacity: 0, y: 40 }}
              animate={inViews[idx] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: idx * 0.15, type: "spring", stiffness: 80 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card shadow={false} color="transparent">
                <CardBody className="text-center">
                  <Icon className="h-10 w-10 mx-auto text-blue-gray-700 mb-4" />
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    {title}
                  </Typography>
                  <Typography className="!text-gray-600">
                    {value}
                  </Typography>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contact; 