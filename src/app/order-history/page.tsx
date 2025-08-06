"use client";

import { Navbar, Footer } from "@/components";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Chip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { FiClock, FiShoppingBag, FiPhone } from 'react-icons/fi';

interface OrderHistoryItem {
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  total: number;
  orderTime: string;
  userEmail: string;
  phoneNumber: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/api/auth/signin');
      return;
    }

    if (session?.user?.email) {
      fetch(`http://localhost:5000/api/orders/user/${session.user.email}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch(err => {
        console.error("Failed to fetch order history", err);
      });
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Typography variant="h2" color="blue-gray" className="mb-8">
              Your Order History
            </Typography>

            {orders.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <FiShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    No Orders Yet
                  </Typography>
                  <Typography className="text-gray-600 mb-4">
                    You haven't placed any orders yet.
                  </Typography>
                  <Button
                    color="blue"
                    onClick={() => router.push('/menu-page')}
                  >
                    Browse Menu
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardBody>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            Order #{order.orderId}
                          </Typography>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <FiClock className="h-4 w-4" />
                            <Typography variant="small">
                              {new Date(order.orderTime).toLocaleString()}
                            </Typography>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <FiPhone className="h-4 w-4" />
                            <Typography variant="small">
                              {order.phoneNumber}
                            </Typography>
                          </div>
                        </div>
                        <Chip
                          value="Completed"
                          color="green"
                        />
                      </div>

                      <div className="border-t border-b border-gray-200 py-4 mb-4">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <Typography color="blue-gray">
                                {item.quantity}x
                              </Typography>
                              <Typography color="blue-gray">
                                {item.name}
                              </Typography>
                            </div>
                            <Typography color="blue-gray">
                              {item.price}
                            </Typography>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <Typography variant="h6" color="blue-gray">
                          Total
                        </Typography>
                        <Typography variant="h6" color="blue">
                          ₹{order.total}
                        </Typography>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 