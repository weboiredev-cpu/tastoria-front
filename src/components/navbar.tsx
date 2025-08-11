"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  UserCircleIcon,
  ShoppingBagIcon,
  PhoneIcon,
  ClockIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
  mobile?: boolean;
  onClick?: () => void;
}

function NavItem({ children, href, mobile, onClick }: NavItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (href?.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    onClick?.();
  };

  return (
    <li className="w-full">
      <a
        href={href || "#"}
        onClick={handleClick}
        className={`flex items-center gap-2 font-medium cursor-pointer transition-all duration-200 ${
          mobile
            ? "w-full px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-600 active:bg-gray-100"
            : "text-inherit hover:text-blue-400 relative group px-1 py-2"
        }`}
      >
        {children}
        {!mobile && (
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
        )}
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
  if (pathname?.startsWith("/admin")) return null;

  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleOpen = () => setOpen((cur) => !cur);
  const closeMenu = () => setOpen(false);
  const toggleUserMenu = () => setUserMenuOpen((cur) => !cur);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && !(event.target as Element).closest("nav")) {
        setOpen(false);
      }
      if (userMenuOpen && !(event.target as Element).closest(".user-menu")) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open, userMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 text-gray-900"
          : "bg-white text-black"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl font-bold tracking-tight transition-colors duration-200 flex-shrink-0 group text-gray-900 hover:text-blue-500"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 transition-colors duration-200 text-gray-800 group-hover:text-blue-500">
              <svg
                viewBox="0 0 100 100"
                fill="currentColor"
                className="w-full h-full transition-transform duration-200 group-hover:scale-110"
              >
                <path d="M25 15 L25 35 Q25 40 30 40 L35 40 Q40 40 40 35 L40 15 M30 15 L30 30 M35 15 L35 30 M20 15 L20 30 M32.5 40 L32.5 80 Q32.5 85 37.5 85 Q42.5 85 42.5 80 L42.5 40" />
                <ellipse cx="70" cy="25" rx="15" ry="20" />
                <rect x="67.5" y="40" width="5" height="40" rx="2.5" />
                <g transform="rotate(45 50 50)">
                  <rect
                    x="47.5"
                    y="20"
                    width="5"
                    height="60"
                    rx="2.5"
                    opacity="0.1"
                  />
                </g>
              </svg>
            </div>
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tastoria Cafe
              </span>
              <span className="text-gray-700 hidden xs:inline"> Cafe</span>
            </div>
          </Link>

          <ul className="hidden xl:flex items-center gap-4 2xl:gap-8">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem key={name} href={href}>
                <Icon className="h-4 w-4 lg:h-5 lg:w-5 opacity-80" />
                <span className="text-sm lg:text-base font-medium whitespace-nowrap">
                  {name}
                </span>
              </NavItem>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-shrink-0">
            {!session ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => signIn("google")}
                  className="px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                >
                  <span className="hidden xl:inline">Sign In</span>
                  <span className="xl:hidden">Login</span>
                </button>
                <Link
                  href="/admin/signin"
                  className="px-3 xl:px-4 py-2 text-xs xl:text-sm font-medium rounded-lg transition-all duration-200 border whitespace-nowrap border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Admin
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 xl:gap-4 relative user-menu">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 xl:gap-3 px-2 xl:px-3 py-2 rounded-lg bg-gray-100/80 backdrop-blur-sm hover:bg-gray-200/80 transition-colors duration-200"
                >
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt="user"
                      className="w-6 h-6 xl:w-8 xl:h-8 rounded-full ring-2 ring-blue-100"
                    />
                  )}
                  <span className="text-xs xl:text-sm font-medium text-gray-700 max-w-20 xl:max-w-32 truncate hidden lg:block">
                    {session.user?.name}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleOpen}
            className="lg:hidden p-2 rounded-lg transition-all duration-200 touch-manipulation hover:bg-gray-100 text-gray-700"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <span
                className={`absolute top-1/2 left-1/2 w-5 sm:w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  open
                    ? "rotate-45 translate-x-0"
                    : "-translate-x-2.5 sm:-translate-x-3 -translate-y-2"
                }`}
              />
              <span
                className={`absolute top-1/2 left-1/2 w-5 sm:w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  open ? "opacity-0" : "-translate-x-2.5 sm:-translate-x-3"
                }`}
              />
              <span
                className={`absolute top-1/2 left-1/2 w-5 sm:w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  open
                    ? "-rotate-45 translate-x-0"
                    : "-translate-x-2.5 sm:-translate-x-3 translate-y-2"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-200/20 shadow-lg">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <ul className="space-y-1 mb-4 sm:mb-6">
              {NAV_MENU.map(({ name, icon: Icon, href }) => (
                <NavItem key={name} href={href} mobile onClick={closeMenu}>
                  <Icon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{name}</span>
                </NavItem>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4 sm:pt-6">
              {!session ? (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      signIn("google");
                      closeMenu();
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm sm:text-base font-medium py-3 sm:py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-95 touch-manipulation"
                  >
                    Sign In with Google
                  </button>
                  <Link
                    href="/admin/signin"
                    onClick={closeMenu}
                    className="block w-full text-center py-3 sm:py-4 text-sm sm:text-base font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 touch-manipulation"
                  >
                    Admin Login
                  </Link>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {session.user?.image && (
                        <img
                          src={session.user.image}
                          alt="user"
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-blue-100 flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        closeMenu();
                      }}
                      className="text-sm sm:text-base text-red-600 font-medium hover:text-red-700 active:text-red-800 transition-colors duration-200 px-2 py-1 rounded touch-manipulation flex-shrink-0"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
