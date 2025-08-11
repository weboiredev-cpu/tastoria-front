"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  FiHome,
  FiMenu,
  FiUsers,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  // Sidebar starts closed on mobile; remains visible on lg via CSS classes
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/signin");
    }
  }, [status, router]);

  // Listen for global toggle events dispatched from pages' navbars
  useEffect(() => {
    const toggle = () => setSidebarOpen((prev) => !prev);
    const open = () => setSidebarOpen(true);
    const close = () => setSidebarOpen(false);

    // Cast to EventListener to satisfy TS DOM typings
    window.addEventListener("toggle-admin-sidebar", toggle as unknown as EventListener);
    window.addEventListener("open-admin-sidebar", open as unknown as EventListener);
    window.addEventListener("close-admin-sidebar", close as unknown as EventListener);

    return () => {
      window.removeEventListener("toggle-admin-sidebar", toggle as unknown as EventListener);
      window.removeEventListener("open-admin-sidebar", open as unknown as EventListener);
      window.removeEventListener("close-admin-sidebar", close as unknown as EventListener);
    };
  }, []);

  const navItems = [
    { label: "Dashboard", icon: FiHome, href: "/admin/dashboard" },
    { label: "Menu", icon: FiMenu, href: "/admin/dashboard/menu" },
    { label: "Users", icon: FiUsers, href: "/admin/dashboard/users" },
    { label: "Settings", icon: FiSettings, href: "/admin/dashboard/settings" },
  ];

  // Relax Material Tailwind types for JSX usage
  const M = {
    Typography: Typography as any,
    List: List as any,
    ListItem: ListItem as any,
    ListItemPrefix: ListItemPrefix as any,
  };

  const sectionSlug = (pathname?.split('/').filter(Boolean)[2] ?? 'dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Top Navbar (visible on all admin pages) */}
      <nav className="fixed top-0 inset-x-0 z-[80] bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden p-2 rounded hover:bg-blue-50"
              aria-label="Toggle sidebar"
              onClick={() => window.dispatchEvent(new Event('toggle-admin-sidebar'))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent leading-none">
              Tastoria Cafe Admin
            </span>

            <span className="hidden sm:inline text-gray-500 text-sm">@{sectionSlug}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-blue-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            {/* Profile dropdown with Sign Out */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                  A
                </span>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">Admin</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition" role="menu">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                  onClick={async () => {
                    await signOut({ redirect: false });
                    router.push('/admin/signin');
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">

        {/* Sidebar */}
        <div
          className={`
        fixed lg:static left-0 top-16 bottom-0 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition duration-200 ease-in-out
        w-64 bg-white shadow-lg z-[70]
      `}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <M.Typography variant="h5" color="blue-gray">
              Admin Panel
            </M.Typography>
            <button
              className="lg:hidden p-2 rounded hover:bg-blue-gray-50"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close</span>
              {/* simple X icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <M.List>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link href={item.href} key={item.href}>
                  <M.ListItem
                    selected={pathname === item.href}
                    className="hover:bg-blue-gray-50"
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <M.ListItemPrefix>
                      <Icon className="h-5 w-5" />
                    </M.ListItemPrefix>
                    {item.label}
                  </M.ListItem>
                </Link>
              );
            })}
          </M.List>
        </div>

        {/* Overlay (below navbar) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-x-0 top-16 bottom-0 bg-black bg-opacity-50 z-[60] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4">
          {status === "loading" ? (
            <div className="flex justify-center items-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : status === "unauthenticated" ? (
            <div className="flex justify-center items-center min-h-screen">
              <p>Redirecting to login...</p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
