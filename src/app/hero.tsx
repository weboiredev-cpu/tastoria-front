"use client";

import { IconButton, Button, Typography } from "@material-tailwind/react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "framer-motion";

interface HeroProps {
  tableId?: string;
  onViewMenu?: () => void;
}

// Material Tailwind component props
const materialProps = {
  placeholder: "",
  onResize: () => {},
  onResizeCapture: () => {},
  onPointerEnterCapture: () => {},
  onPointerLeaveCapture: () => {},
  onAnimationStart: () => {},
  onDragStart: () => {},
  onDragEnd: () => {},
  onDrag: () => {},
};

function Hero({ tableId, onViewMenu }: HeroProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleMenuClick = () => {
    if (!session) {
      toast.error('Please sign in to view the menu', {
        duration: 3000,
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
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
      >
        <img
          src="/image/newCafe.jpg"
          alt="Tastoria Cafe"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 h-full w-full bg-gray-900/50" 
      />

      {/* Content */}
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Typography variant="h3" color="white" className="mb-2" {...materialProps}>
              Open Daily 7AM - 10PM @ Parbhani
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Typography variant="h1" color="white" className="lg:max-w-3xl" {...materialProps}>
              Tastoria Cafe: Where Every Sip Tells a Story
            </Typography>
          </motion.div>

          <motion.div 
            className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Typography variant="lead" color="white" {...materialProps}>
              Experience the perfect blend of artisanal coffee, gourmet cuisine, and warm hospitality in our cozy Tastoria Cafe.
            </Typography>
            {tableId && (
              <Typography variant="lead" color="white" className="mt-4" {...materialProps}>
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
              <Button 
                variant="gradient" 
                color="white"
                onClick={handleMenuClick}
                {...materialProps}
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
