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
    <footer className="relative w-full bg-gradient-to-br from-blue-50 via-white to-amber-50 px-6 sm:px-12 py-12 border-t border-gray-200">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            {/* Fixed container with explicit dimensions */}
            <div className="relative w-[160px] h-[60px] mb-4 flex-shrink-0">
              <Image
                src="/image/Tastoria.webp"
                alt="Tastoria Cafe Logo"
                fill
                sizes="160px"
                className="object-contain"
                priority={false}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Cp/Z"
              />
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-[200px]">
              Bringing flavors to life, one bite at a time.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h6 className="mb-4 text-gray-800 font-semibold text-base">Quick Links</h6>
            <ul className="space-y-2">
              {LINKS.map((link, idx) => (
                <li key={idx} className="h-6"> {/* Fixed height for consistency */}
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-amber-600 transition-colors duration-200 text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h6 className="mb-4 text-gray-800 font-semibold text-base">Follow Us</h6>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.title}
                  className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-amber-600 transition-colors duration-200 flex-shrink-0"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info (Optional 4th column) */}
          <div>
            <h6 className="mb-4 text-gray-800 font-semibold text-base">Contact</h6>
            <p className="text-gray-600 text-sm">
              Visit us for the best<br />
              cafe experience
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-500 text-sm leading-relaxed">
            © {currentYear} Tastoria Cafe. All rights reserved.
            <br />
            Developed by Tastoria
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;