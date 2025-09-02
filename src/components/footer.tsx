"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
const LINKS = [
  { title: "Menu", href: "/menu-page" },
  { title: "About Us", href: "#about" },
  { title: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  {
    title: "Facebook",
    icon: Facebook,
    href: "https://facebook.com/paradisecafe",
  },
  {
    title: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/tastoria_cafe_mh22",
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full min-h-[220px] bg-gradient-to-br from-blue-50 via-white to-amber-50 px-6 sm:px-12 py-12 border-t border-gray-200">

      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 min-h-[120px]">
        {/* Logo Section */}
        <div className="flex flex-col items-start">
          <div className="relative w-[160px] h-[60px]">
            <Image
              src="/image/Tastoria.webp"
              alt="Tastoria Cafe Logo"
              width={160}
              height={60}
              className="mb-4 object-contain"
            />
          </div>

        
        </div>

        {/* Navigation Links */}
        <div>
          <h6 className="mb-4 text-gray-800 font-semibold">Quick Links</h6>
          <ul className="space-y-2">
            {LINKS.map((link, idx) => (
              <li key={idx}>
                <Link
                  href={link.href}
                  className="text-gray-600 hover:text-amber-600 transition"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h6 className="mb-4 text-gray-800 font-semibold">Follow Us</h6>
          <div className="flex space-x-4">
            {SOCIAL_LINKS.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.title}
                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-amber-600 transition"
              >
                <social.icon className="w-5 h-5 shrink-0"/>

              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-200 pt-6 text-center">
        <p className="text-gray-500 text-sm">
          © {currentYear} Tastoria Cafe. All rights reserved.
          <br />
          Developed by Tastoria
        </p>
      </div>
    </footer>
  );
}

export default Footer;
