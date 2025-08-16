"use client";

import { Typography } from "@material-tailwind/react";
import Link from "next/link";

const LINKS = [
  { title: "Menu", href: "/menu-page" },
  { title: "About Us", href: "/#about" },
  { title: "Contact", href: "/#contact" },
];

const SOCIAL_LINKS = [
  {
    title: "Facebook",
    icon: "fab fa-facebook",
    href: "https://facebook.com/paradisecafe",
  },
  {
    title: "Instagram",
    icon: "fab fa-instagram",
    href: "https://www.instagram.com/tastoria_cafe_mh22",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  // 1. Remove the symbol from the beginning of the string
  const marqueeText = "Welcome to Tastoria Cafe — Serving Happiness in Every Cup ☕ — Freshly Brewed Coffee • Delicious Pastries • Cozy Vibes";

  return (

    <footer className="relative w-full bg-white px-4 pt-8 sm:px-8">
      <div className="container mx-auto">
        {/* Top Section */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left gap-6">
          <Typography variant="h5" className="font-bold text-gray-800">
            Tastoria Cafe
          </Typography>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="py-1 font-normal text-gray-700 transition-colors hover:text-blue-500"
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 text-gray-700 transition-transform hover:scale-110 hover:text-blue-500"
              >
                <i className={`${link.icon} text-xl`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Advanced Fade & Blur Scroll Marquee */}
        <div className="marquee-container mt-8 text-sm font-medium text-gray-700">
           {/* 2. Add the diamond symbol as a separator between the text spans */}
          <div className="marquee-content">
            <span>{marqueeText}</span>
            <span className="mx-3">⚡︎</span>
            <span>{marqueeText}</span>
            <span className="mx-3">⚡︎</span>
          </div>
          <div className="marquee-content" aria-hidden="true">
            <span>{marqueeText}</span>
            <span className="mx-3">⚡︎</span>
            <span>{marqueeText}</span>
            <span className="mx-3">⚡︎</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 py-4 border-t border-gray-200 text-center space-y-1">
          <Typography variant="small" className="font-normal text-gray-600">
            &copy; {currentYear} Tastoria Cafe. All rights reserved.
          </Typography>
          <Typography variant="small" className="font-normal text-gray-600">
            Developed by Tastoria
            <br></br>
            <br></br>
          </Typography>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        .marquee-container {
          --gap: 1.5rem;
          --scroll-start: 0;
          --scroll-end: calc(-100% - var(--gap));
          
          display: flex;
          user-select: none;
          gap: var(--gap);
          position: relative;
          overflow: hidden;
          padding-top: 1rem;
          padding-bottom: 1rem;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;

          mask-image: linear-gradient(
            to right,
            hsl(0 0% 0% / 0),
            hsl(0 0% 0% / 1) 15%,
            hsl(0 0% 0% / 1) 85%,
            hsl(0 0% 0% / 0)
          );
        }

        @keyframes scroll {
          to {
            transform: translateX(var(--scroll-end));
          }
        }

        .marquee-content {
          flex-shrink: 0;
          display: flex;
          justify-content: space-around;
          align-items: center; /* Vertically center the content */
          gap: var(--gap);
          min-width: 100%;
          animation: scroll 35s linear infinite;
        }

      `}</style>
    </footer>
  );
}

export default Footer;