"use client";

import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import { useParams, useRouter } from "next/navigation";
import { FiCheckCircle, FiPhone, FiUser, FiClock, FiMapPin } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface OrderDetails {
  customerName: string;
  phoneNumber: string;
  tableId: string;
  orderTime: string;
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

  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // For now, we'll simulate it with localStorage
    const lastOrder = localStorage.getItem(`table_${tableId}_last_order`);
    if (lastOrder) {
      setOrderDetails(JSON.parse(lastOrder));
    }
  }, [tableId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
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
                  <div className="bg-green-100 p-4 rounded-full">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.2
                      }}
                    >
                      <FiCheckCircle className="h-16 w-16 text-green-500" />
                    </motion.div>
                  </div>
                </div>
                <Typography
                  variant="h3"
                  color="blue-gray"
                  className="mb-2 font-bold"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                >
                  Order Placed Successfully!
                </Typography>
                <Typography
                  color="gray"
                  className="mb-8"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                >
                  Your order has been received and will be prepared shortly
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