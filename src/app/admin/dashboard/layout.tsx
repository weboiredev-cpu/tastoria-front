"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/signin");
    }
  }, [status, router]);

  const navItems = [
    { label: "Dashboard", icon: FiHome, href: "/admin/dashboard" },
    { label: "Menu", icon: FiMenu, href: "/admin/dashboard/menu" },
    { label: "Users", icon: FiUsers, href: "/admin/dashboard/users" },
    { label: "Settings", icon: FiSettings, href: "/admin/dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        className="lg:hidden fixed z-50 bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <FiMenu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition duration-200 ease-in-out
        w-64 bg-white shadow-lg z-30
      `}
      >
        <div className="p-4 border-b">
          <Typography variant="h5" color="blue-gray">
            Admin Panel
          </Typography>
        </div>
        <List>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} key={item.href}>
                <ListItem
                  selected={pathname === item.href}
                  className="hover:bg-blue-gray-50"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <ListItemPrefix>
                    <Icon className="h-5 w-5" />
                  </ListItemPrefix>
                  {item.label}
                </ListItem>
              </Link>
            );
          })}
          <ListItem
            className="text-red-500 hover:bg-red-50 focus:bg-red-50 cursor-pointer"
            onClick={() => router.push("/admin/signin")}
          >
            <ListItemPrefix>
              <FiLogOut className="h-5 w-5" />
            </ListItemPrefix>
            Logout
          </ListItem>
        </List>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
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
  );
}
