"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

import {
  UserCircleIcon,
  ShoppingBagIcon,
  PhoneIcon,
  XMarkIcon,
  Bars3Icon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (href?.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <li>
      <a
        href={href || "#"}
        onClick={handleClick}
        className="flex items-center gap-2 font-medium cursor-pointer text-inherit"
      >
        {children}
      </a>
    </li>
  );
}

const NAV_MENU = [
  { name: "About", icon: UserCircleIcon, href: "/#about" },
  { name: "Menu", icon: ShoppingBagIcon, href: "/menu-page" },
  { name: "Contact", icon: PhoneIcon, href: "/#contact" },
  { name: "Order History", icon: ClockIcon, href: "/order-history" },
];

export function Navbar() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  const [open, setOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const { data: session } = useSession();

  const handleOpen = () => setOpen((cur) => !cur);

  useEffect(() => {
    const handleResize = () => window.innerWidth >= 960 && setOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolling(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-colors duration-300 ${isScrolling ? 'bg-white text-gray-900' : 'bg-transparent text-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold">
            Tastoria Cafe
          </Link>

          <ul className="hidden lg:flex items-center gap-6">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <Icon className="h-5 w-5" />
                <span>{name}</span>
              </NavItem>
            ))}
          </ul>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {!session ? (
              <button
                onClick={() => signIn('google')}
                className="px-4 py-2 text-sm font-medium"
              >
                Sign In with Google
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt="user"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
            {!session && (
              <Link
                href="/admin/signin"
                className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-white hover:text-gray-900 transition-colors"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Hamburger Icon */}
          <button onClick={handleOpen} className="lg:hidden">
            {open ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="lg:hidden px-4 pt-4 pb-4 bg-white text-gray-900 rounded-b-xl shadow-md space-y-4">
          {/* Menu Links */}
          <ul className="space-y-2 list-none">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                  <Icon className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">{name}</span>
                </div>
              </NavItem>
            ))}
          </ul>


          <hr className="border-gray-200" />

          {/* Auth Section */}
          <div className="space-y-3">
            {!session ? (
              <button
                onClick={() => signIn('google')}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium py-2 rounded-md"
              >
                Sign In with Google
              </button>
            ) : (
              <div className="flex items-center justify-between px-3 py-2 rounded-md bg-gray-100">
                <div className="flex items-center gap-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt="user"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium">{session.user?.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}

            {!session && (
              <Link
                href="/admin/signin"
                className="block w-full text-center py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
