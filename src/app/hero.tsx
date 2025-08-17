"use client";

import { Button, Typography } from "@material-tailwind/react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "framer-motion";
import Image from 'next/image';

interface HeroProps {
  tableId?: string;
  onViewMenu?: () => void;
}

function Hero({ tableId, onViewMenu }: HeroProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleMenuClick = () => {
    if (!session) {
      toast.error('Please sign in to view the menu', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#f44336',
          color: '#fff',
          padding: '16px',
        },
      });
    } else {
      if (tableId && onViewMenu) {
        onViewMenu();
      } else {
        router.push('/menu-page');
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <Toaster />

      {/* Image Background */}
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="absolute inset-0"
      >
        <Image
          src="/image/newCafe.jpg"
          alt="Tastoria Cafe"
          fill
          style={{ objectFit: 'cover' }}
          priority={false}
        />
      </motion.div>

      {/* Overlay */}
      <motion.div
        initial={false}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 0.1 }}
        className="absolute inset-0 h-full w-full bg-gray-900/50"
      />

      {/* Content */}
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* ✅ Added props to fix build error */}
            <Typography
              variant="h1"
              color="white"
              className="lg:max-w-3xl"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              Tastoria Cafe: Where Every Sip Tells a Story
            </Typography>
          </motion.div>

          <motion.div
            className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {/* ✅ Added props to fix build error */}
            <Typography
              variant="lead"
              color="white"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              Experience the perfect blend of artisanal coffee, gourmet cuisine, and warm hospitality in our cozy Tastoria Cafe.
            </Typography>
            {tableId && (
              <Typography
                variant="lead"
                color="white"
                className="mt-4"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                <span className="font-bold">Table {tableId}</span>
              </Typography>
            )}
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* ✅ Added props to fix build error */}
              <Button
                variant="gradient"
                color="white"
                onClick={handleMenuClick}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                View Menu
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Hero;