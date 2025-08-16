"use client";

import { Navbar, Footer } from "@/components";
import {
  Typography,
  Card,
  CardBody,
  Button,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiClock, FiMail, FiPhone, FiShoppingBag } from 'react-icons/fi';
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';

interface OrderDetails {
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  orderTime: string;
  userEmail: string;
  phoneNumber: string;
}

interface CartItem {
  name: string;
  quantity: number;
  price: number;
  img: string;
  description: string;
}

export default function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.email) {
      router.push('/api/auth/signin');
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
      if (!cart.length) {
        router.push('/menu-page');
        return;
      }

      const total = cart.reduce((sum: number, item: CartItem) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const newOrder = {
        orderId: `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        items: cart,
        total: total,
        orderTime: new Date().toLocaleString(),
        userEmail: session.user.email,
        phoneNumber: localStorage.getItem('userPhone') || '',
      };

      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.push(newOrder);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

      setOrderDetails(newOrder);
      localStorage.setItem('cart', '[]');

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/phone`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          phone: localStorage.getItem('userPhone') || '',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Phone number saved:', data);
        })
        .catch((err) => {
          console.error('Failed to save phone number:', err);
        });
    } catch (error) {
      console.error('Error processing order:', error);
      router.push('/menu-page');
    }
  }, [router, session]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <Typography variant="h6" color="gray">
            Processing your order...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <div className="bg-green-100 p-4 rounded-full">
                  <FiCheckCircle className="h-20 w-20 text-green-500" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Typography variant="h2" color="blue-gray" className="mb-4 font-bold">
                  Order Confirmed!
                </Typography>
                <Typography variant="lead" className="text-gray-600">
                  Thank you for ordering at Paradise Cafe
                </Typography>
              </motion.div>
            </div>

            <Card className="mb-8 shadow-lg border border-blue-50">
              <CardBody>
                <div className="space-y-6">
                  {/* Order Details */}
                  <List>
                    <ListItem className="p-0">
                      <ListItemPrefix>
                        <FiShoppingBag className="h-5 w-5 text-blue-500" />
                      </ListItemPrefix>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          Order ID
                        </Typography>
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                          {orderDetails.orderId}
                        </Typography>
                      </div>
                    </ListItem>
                    <ListItem className="p-0">
                      <ListItemPrefix>
                        <FiClock className="h-5 w-5 text-blue-500" />
                      </ListItemPrefix>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          Order Time
                        </Typography>
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                          {orderDetails.orderTime}
                        </Typography>
                      </div>
                    </ListItem>
                    <ListItem className="p-0">
                      <ListItemPrefix>
                        <FiMail className="h-5 w-5 text-blue-500" />
                      </ListItemPrefix>
                      <div className="flex flex-col">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          Email
                        </Typography>
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                          {orderDetails.userEmail}
                        </Typography>
                      </div>
                    </ListItem>
                    {orderDetails.phoneNumber && (
                      <ListItem className="p-0">
                        <ListItemPrefix>
                          <FiPhone className="h-5 w-5 text-blue-500" />
                        </ListItemPrefix>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            Phone
                          </Typography>
                          <Typography variant="h6" color="blue-gray" className="font-bold">
                            {orderDetails.phoneNumber}
                          </Typography>
                        </div>
                      </ListItem>
                    )}
                  </List>

                  {/* Order Summary */}
                  <div className="bg-blue-50 p-6 rounded-xl space-y-4">
                    <Typography variant="h6" color="blue-gray" className="font-bold">
                      Order Summary
                    </Typography>
                    <div className="space-y-2">
                      {orderDetails.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">
                              {item.quantity}x
                            </span>
                            <span className="text-sm text-gray-800">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-blue-100 pt-2 mt-2">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-gray-800">Total</span>
                          <span className="text-blue-600">₹{orderDetails.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                    <Typography className="text-amber-900 font-medium text-center">
                      Please proceed to the counter to make your payment
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/order-history" className="block">
                      <Button 
                        color="blue" 
                        className="w-full flex items-center justify-center gap-2"
                        size="lg"
                      >
                        <span>View Order History</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </Link>
                    <Link href="/menu-page" className="block">
                      <Button 
                        color="blue" 
                        variant="outlined" 
                        className="w-full flex items-center justify-center gap-2"
                        size="lg"
                      >
                        <span>Order More</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
} 