'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const OrderOptions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get('table');

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Validate table number on page load
  useEffect(() => {
    if (!mounted) return;

    if (!tableNumber) {
      toast.error('Please scan your table\'s QR code');
      return;
    }

    if (!/^[1-9][0-9]*$/.test(tableNumber)) {
      toast.error('Invalid table number');
      return;
    }
  }, [tableNumber, mounted]);

  const handleWhatsAppOrder = () => {
    if (!tableNumber || !/^[1-9][0-9]*$/.test(tableNumber)) {
      toast.error('Please scan your table\'s QR code first');
      return;
    }

    const message = `Hello! I am at Table ${tableNumber}. I want to order.`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=15556616132&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWebsiteOrder = () => {
    if (!tableNumber || !/^[1-9][0-9]*$/.test(tableNumber)) {
      toast.error('Please scan your table\'s QR code first');
      return;
    }

    setIsLoading(true);
    router.push(`/table/${tableNumber}`);
  };

  if (!mounted) {
    return null;
  }

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
          {/* Header Section */}
          <div className="w-full bg-white shadow-sm py-4 px-6 fixed top-0 z-10">
            <h1 className="text-2xl font-bold text-blue-600">
              Paradise Restaurant
            </h1>
            {tableNumber && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{tableNumber}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your Table Number
                </p>
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
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
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
                        <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm-4 7h8a1 1 0 010 2H8a1 1 0 010-2zm0-3h8a1 1 0 010 2H8a1 1 0 110-2z"/>
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

              {/* Features Section */}
              <div className="mt-16 grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Quick Ordering
                  </h4>
                  <p className="text-gray-600">
                    Place your order in minutes
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Secure Payment
                  </h4>
                  <p className="text-gray-600">
                    Safe and secure transactions
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Customer Satisfaction
                  </h4>
                  <p className="text-gray-600">
                    Quality food and service
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderOptions; 