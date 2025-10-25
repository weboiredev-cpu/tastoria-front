"use client";

import { Typography, Button, Card, CardBody, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useParams, useRouter } from "next/navigation";
import { FiCheckCircle, FiPhone, FiUser, FiClock, FiMapPin } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface OrderDetails {
  customerName: string;
  phoneNumber: string;
  tableId: string;
  orderTime: string;
  status: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function OrderSuccess() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId;
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<string | null>(null);

  // Monitor state changes
  useEffect(() => {
    console.log('[OrderSuccess] State changed:', {
      hasOrderDetails: !!orderDetails,
      showPopup,
      orderData: orderDetails
    });
  }, [orderDetails, showPopup]);

useEffect(() => {
  const getOrderDetails = async () => {
    console.log('[OrderSuccess] Starting order fetch for table:', tableId);

    try {
      console.log('[OrderSuccess] Fetching from API:', `/api/orders/table/${tableId}`);
      const res = await fetch(`/api/orders/table/${tableId}`);
      console.log('[OrderSuccess] API Response status:', res.status);
      
      const data = await res.json();
      console.log('[OrderSuccess] API Response data:', data);

      if (data.success && data.order) {
        console.log('[OrderSuccess] Valid order received, setting details:', data.order);
        console.log('[OrderSuccess] Current previousStatus:', previousStatus);
        console.log('[OrderSuccess] New order status:', data.order.status);
        
        // Check if status changed from pending to confirmed
        if (previousStatus === 'pending' && data.order.status === 'confirmed') {
          console.log('[OrderSuccess] Status changed from pending to confirmed - showing popup!');
          setShowPopup(true);
        }
        
        setPreviousStatus(data.order.status);
        setOrderDetails(data.order);
        
        // If order is already confirmed on first load, show popup
        if (!previousStatus && data.order.status === 'confirmed') {
          console.log('[OrderSuccess] Order already confirmed on first load - showing popup!');
          setShowPopup(true);
        }
      } else {
        console.log('[OrderSuccess] Order not found:', data.message);
      }
    } catch (error) {
      console.error('[OrderSuccess] Error fetching order:', error);
    }
  };

  getOrderDetails();
}, [tableId]);

// Polling effect to check for status changes
useEffect(() => {
  if (!orderDetails) return;

  const pollTimer = setInterval(async () => {
    console.log('[OrderSuccess] Polling for order status changes...');
    try {
      const pollRes = await fetch(`/api/orders/table/${tableId}`);
      const pollData = await pollRes.json();
      
      if (pollData.success && pollData.order) {
        const currentStatus = pollData.order.status;
        console.log('[OrderSuccess] Poll result - Current:', currentStatus, 'Previous:', previousStatus);
        
        // Check if status changed from pending to confirmed
        if (previousStatus === 'pending' && currentStatus === 'confirmed') {
          console.log('[OrderSuccess] Status changed from pending to confirmed - showing popup!');
          setShowPopup(true);
        }
        
        // Update status if it changed
        if (currentStatus !== previousStatus) {
          console.log('[OrderSuccess] Status changed from', previousStatus, 'to', currentStatus);
          setPreviousStatus(currentStatus);
          setOrderDetails(pollData.order);
        }
        
        // Stop polling if order is completed or cancelled
        if (currentStatus === 'completed' || currentStatus === 'cancelled') {
          console.log('[OrderSuccess] Order finished, stopping polling');
          clearInterval(pollTimer);
        }
      }
    } catch (pollError) {
      console.error('[OrderSuccess] Poll error:', pollError);
    }
  }, 3000); // Poll every 3 seconds

  // Cleanup interval on unmount
  return () => clearInterval(pollTimer);
}, [tableId, orderDetails, previousStatus]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Debug overlay */}
      {/*
      <div className="fixed top-4 right-4 bg-white p-4 rounded shadow-lg z-[9999] text-xs">
        <div>Table ID: {tableId}</div>
        <div>Show Popup: {String(showPopup)}</div>
        <div>Has Order: {String(!!orderDetails)}</div>
        <div>Current Status: {orderDetails?.status || 'N/A'}</div>
        <div>Previous Status: {previousStatus || 'N/A'}</div>
        <button 
          onClick={() => setShowPopup(true)} 
          className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
        >
          Force Show Popup
        </button>
      </div>
       */}
      {/* Confirmation Dialog */}
      <Dialog 
        open={showPopup} 
        handler={() => setShowPopup(false)}
        className="z-[9999]"
        placeholder={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          placeholder={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Typography 
            variant="h5" 
            color="blue-gray"
            placeholder={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Order Confirmed!
          </Typography>
        </DialogHeader>
        <DialogBody 
          divider
          placeholder={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="flex items-center gap-3">
            <FiCheckCircle className="h-8 w-8 text-green-500" />
            <Typography 
              color="gray"
              placeholder={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Your order is confirmed by the admin
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter
          placeholder={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Button
            variant="text"
            color="blue"
            onClick={() => setShowPopup(false)}
            placeholder={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      <div className="container mx-auto px-4 py-32">
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* ✅ Added props to fix build error */}
          <Card
            className="border border-blue-50 shadow-lg overflow-hidden"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            <CardBody
              className="p-8"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              <motion.div
                className="text-center"
                variants={itemVariants}
              >
                <div className="flex justify-center mb-6">
                  <div className={`p-4 rounded-full ${
                    orderDetails?.status === 'confirmed' ? 'bg-green-100' :
                    orderDetails?.status === 'completed' ? 'bg-blue-100' :
                    orderDetails?.status === 'cancelled' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.2
                      }}
                    >
                      <FiCheckCircle className={`h-16 w-16 ${
                        orderDetails?.status === 'confirmed' ? 'text-green-500' :
                        orderDetails?.status === 'completed' ? 'text-blue-500' :
                        orderDetails?.status === 'cancelled' ? 'text-red-500' :
                        'text-yellow-500'
                      }`} />
                    </motion.div>
                  </div>
                </div>
                <Typography
                  variant="h3"
                  color="blue-gray"
                  className="mb-2 font-bold"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                >
                  {orderDetails?.status === 'confirmed' ? 'Order Confirmed!' : 
                   orderDetails?.status === 'completed' ? 'Order Completed!' :
                   orderDetails?.status === 'cancelled' ? 'Order Cancelled' :
                   'Order Placed Successfully!'}
                </Typography>
                <Typography
                  color="gray"
                  className="mb-8"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                >
                  {orderDetails?.status === 'confirmed' ? 'Your order has been confirmed and will be prepared shortly' :
                   orderDetails?.status === 'completed' ? 'Your order has been completed. Thank you for dining with us!' :
                   orderDetails?.status === 'cancelled' ? 'Your order has been cancelled. Please contact staff if this was a mistake.' :
                   'Your order has been received and is being processed'}
                </Typography>
              </motion.div>

              <motion.div
                className="space-y-6"
                variants={itemVariants}
              >
                <div className="bg-blue-50 p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FiMapPin className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                      >
                        Table Number
                      </Typography>
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="font-bold"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                      >
                        Table {tableId}
                      </Typography>
                    </div>
                  </div>

                  {orderDetails && (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FiUser className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                          >
                            Customer Name
                          </Typography>
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="font-bold"
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                          >
                            {orderDetails.customerName}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FiPhone className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                          >
                            Phone Number
                          </Typography>
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="font-bold"
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                          >
                            {orderDetails.phoneNumber}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FiClock className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                          >
                            Order Time
                          </Typography>
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="font-bold"
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                          >
                            {new Date(orderDetails.orderTime).toLocaleString()}
                          </Typography>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                  <Typography
                    className="text-amber-900 font-medium text-center"
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                  >
                    Please proceed to the counter to make your payment
                  </Typography>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    color="blue"
                    className="flex items-center gap-2"
                    onClick={() => router.push(`/table/${tableId}`)}
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                  >
                    <span>Order More Items</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                </div>
              </motion.div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}