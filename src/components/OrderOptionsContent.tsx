'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function OrderOptionsContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!tableNumber) {
      toast.error("Please scan your table's QR code");
      return;
    }

    if (!/^[1-9][0-9]*$/.test(tableNumber)) {
      toast.error('Invalid table number');
      return;
    }
  }, [tableNumber, mounted]);

  const handleWhatsAppOrder = () => {
    if (!tableNumber || !/^[1-9][0-9]*$/.test(tableNumber)) {
      toast.error("Please scan your table's QR code first");
      return;
    }
    const message = `Hello! I am at Table ${tableNumber}. I want to order.`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=15556616132&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWebsiteOrder = () => {
    if (!tableNumber || !/^[1-9][0-9]*$/.test(tableNumber)) {
      toast.error("Please scan your table's QR code first");
      return;
    }
    setIsLoading(true);
    router.push(`/table/${tableNumber}`);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Toaster position="top-center" />
      {isLoading ? (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-700">Loading your table Page...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="w-full bg-white shadow-sm py-4 px-6 fixed top-0 z-10">
            <h1 className="text-2xl font-bold text-blue-600">Paradise Restaurant</h1>
            {tableNumber && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{tableNumber}</span>
                </div>
                <p className="text-sm text-gray-600">Your Table Number</p>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 pt-24 pb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              {/* Welcome Message */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Welcome to Paradise!
                </h2>
                <p className="text-lg text-gray-600">
                  {tableNumber 
                    ? "Choose your preferred way to order"
                    : "Please scan your table's QR code to start ordering"}
                </p>
              </div>

              {/* Order Options */}
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* WhatsApp Option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="..." /> {/* WhatsApp icon path */}
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                      Order via WhatsApp
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                      Chat with us directly and place your order through WhatsApp
                    </p>
                    <button
                      onClick={handleWhatsAppOrder}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                        tableNumber ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!tableNumber}
                    >
                      <span>Open WhatsApp</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </motion.div>

                {/* Website Option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="..." /> {/* Website icon path */}
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
                      Order via Website
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                      Browse our full menu and order directly through our website
                    </p>
                    <button
                      onClick={handleWebsiteOrder}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                        tableNumber ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!tableNumber}
                    >
                      <span>View Menu</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Features */}
              <div className="mt-16 grid md:grid-cols-3 gap-8">
                {/* Repeat your features section unchanged */}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
