import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Layout } from "@/components";
import AuthProvider from "./auth-provider";
import { Toaster } from 'react-hot-toast';
import { Navbar , Footer } from "@/components";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tastoria Cafe - Where Every Sip Tells a Story",
  description:
    "Experience the perfect blend of artisanal coffee, gourmet cuisine, and warm hospitality at Tastoria Cafe. Your cozy destination for quality coffee and memorable moments.",
  icons: {
    icon: "/Favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-site="YOUR_DOMAIN_HERE"
          src="https://api.nepcha.com/js/nepcha-analytics.js"
        ></script>
        {/* Favicon is provided via metadata.icons and app/Favicon.ico */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={roboto.className}>
        <AuthProvider>
          <Layout>
            <Navbar />
            <main className="flex-grow">
              <Toaster position="top-center" />
              {children}
            </main>
          <Footer />
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
