"use client";

import { Typography } from "@material-tailwind/react";
import Link from "next/link";

const LINKS = [
  { title: "Menu", href: "/menu-page" },
  { title: "About Us", href: "#about" },
  { title: "Contact", href: "#contact" },
];
const SOCIAL_LINKS = [
  {
    title: "Facebook",
    icon: "fab fa-facebook-f",
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

   return (
    <footer className="relative w-full bg-gradient-to-br from-blue-50 via-white to-amber-50 px-6 sm:px-12 py-12 border-t border-gray-200">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        {/* Brand Section */}
        <div>
          <Typography variant="h5" className="font-bold text-gray-800 mb-2">
            Tastoria Cafe
          </Typography>
          <p className="text-sm text-gray-600 leading-relaxed">
            Serving happiness in every cup ☕ <br />
            Freshly brewed coffee & delicious pastries.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <Typography variant="h6" className="font-semibold text-gray-800 mb-3">
            Quick Links
          </Typography>
          <ul className="space-y-2">
            {LINKS.map((link) => (
              <li key={link.title}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <Typography variant="h6" className="font-semibold text-gray-800 mb-3">
            Follow Us
          </Typography>
          <div className="flex justify-center sm:justify-start gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md text-gray-700 transition-all duration-300 hover:scale-110 hover:text-blue-600 hover:shadow-lg"
              >
                <i className={`${link.icon} text-lg`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 pt-6 border-t border-gray-200 text-center">
        <Typography variant="small" className="text-gray-600">
          &copy; {currentYear} Tastoria Cafe. All rights reserved.
        </Typography>
        <Typography variant="small" className="text-gray-500 mt-1">
          Developed by Tastoria
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
