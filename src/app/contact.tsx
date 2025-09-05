"use client";
import React, { useRef } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { MapPinIcon, PhoneIcon, ClockIcon } from "@heroicons/react/24/solid";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { motion, useInView } from "framer-motion";

// Main contact details
const contactInfoData = [
  {
    icon: MapPinIcon,
    title: "Our Address",
    value: "Parbhani 431401",
    link: "https://www.google.com/maps?q=Parbhani+431401",
  },
  {
    icon: PhoneIcon,
    title: "Phone Number",
    value: "+91 8055221419",
    link: "tel:+918055221419",
  },
  {
    icon: ClockIcon,
    title: "Opening Hours",
    value: "Mon - Sun: 7:00 AM - 10:00 PM",
    link: "#",
  },
];

// Social media links
const socialMediaData = [
  {
    icon: FaInstagram,
    title: "Instagram",
    value: "@yourusername",
    link: "https://www.instagram.com/tastoria_2025?igsh=dTAxOGNiYjc5a2ts",
  },
  {
    icon: FaFacebook,
    title: "Facebook",
    value: "Our Facebook Page",
    link: "https://facebook.com/yourusername",
  },
];

// ✅ Define the types for the component's props
type ContactCardProps = {
  icon: React.ElementType;
  title: string;
  value: string;
  link: string;
  delay: number;
};

// A reusable component for the contact cards to reduce repetition
const ContactCard = ({ icon: Icon, title, value, link, delay }: ContactCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: delay, type: "spring", stiffness: 80 }}
      whileHover={{ scale: 1.03 }}
      className="block"
    >
      <Card
        shadow={false}
        color="transparent"
        className="cursor-pointer"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        <CardBody
          className="text-center"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          <Icon className="h-10 w-10 mx-auto text-blue-gray-700 mb-4" />
          <Typography
            variant="h5"
            color="blue-gray"
            className="mb-2"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {title}
          </Typography>
          <Typography
            className="!text-gray-600"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {value}
          </Typography>
        </CardBody>
      </Card>
    </motion.a>
  );
};

export function Contact() {
  return (
    <section id="contact" className="py-20 px-8">
      <div className="container mx-auto text-center">
        <Typography
          variant="h2"
          color="blue-gray"
          className="mb-4"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          Contact & Location
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto lg:w-3/5 !text-gray-500 mb-12"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          We'd love to hear from you! Visit us, give us a call, or drop us a line. We're here to make your day a little more delicious.
        </Typography>

        {/* Grid for Top Row: Address, Phone, Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {contactInfoData.map((props, idx) => (
            <ContactCard key={props.title} {...props} delay={idx * 0.15} />
          ))}
        </div>

        {/* Grid for Bottom Row: Social Media */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:w-2/3 mx-auto">
          {socialMediaData.map((props, idx) => (
            <ContactCard key={props.title} {...props} delay={idx * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contact;
