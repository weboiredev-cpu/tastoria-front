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
import { FiClock, FiShoppingBag, FiPhone, FiCheckCircle, FiPackage, FiTrendingUp } from 'react-icons/fi';
import Loading from "@/components/Loading"

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
  status: "pending" | "waiting" | "confirmed" | "completed" | "cancelled";
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Material Tailwind component props
  const materialProps = {
    placeholder: "",
    onResize: undefined,
    onResizeCapture: undefined,
    onPointerEnterCapture: undefined,
    onPointerLeaveCapture: undefined,
    onAnimationStart: undefined,
    onDragStart: undefined,
    onDragEnd: undefined,
    onDrag: undefined
  };
  const totalOrdersCount = orders.length;

  const completedOrdersCount = orders.filter(o => o.status === "completed").length;

  const totalSpent = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace('/api/auth/signin');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <Loading />
          <Typography variant="h6" color="blue-gray" className="animate-pulse">
            Loading your orders...
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
                <FiPackage className="h-10 w-10 text-white" />
              </div>
              <Typography variant="h2" color="blue-gray" className="mb-4 font-bold" >
                Your Order History
              </Typography>
              <Typography variant="lead" color="gray" className="max-w-2xl mx-auto">
                Track all your past orders and relive your delicious dining experiences
              </Typography>
            </div>

            {/* Stats Section */}
            {orders.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <CardBody className="text-center" >
                    <FiTrendingUp className="h-8 w-8 mx-auto mb-3" />
                    <Typography variant="h4" className="font-bold" >
                    {totalOrdersCount}
                    </Typography>
                    <Typography variant="small" >
                      Total Orders
                    </Typography>
                  </CardBody>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300" >
                  <CardBody className="text-center" >
                    <FiCheckCircle className="h-8 w-8 mx-auto mb-3" />
                    <Typography variant="h4" className="font-bold" >
                    {completedOrdersCount}
                    </Typography>
                    <Typography variant="small" >
                      Completed Orders
                    </Typography>
                  </CardBody>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300" >
                  <CardBody className="text-center">
                    <FiShoppingBag className="h-8 w-8 mx-auto mb-3" />
                    {/*<Typography variant="h4" className="font-bold" >
                      ₹{orders.reduce((sum, order) => sum + order.total, 0)}
                    </Typography>*/}
                    
                    <Typography variant="h4" >
                    ₹{totalSpent}
                    </Typography>
                    <Typography variant="small" >
                      Total Amount Spent
                    </Typography>
                  </CardBody>
                </Card>
              </div>
            )}

            {orders.length === 0 ? (
              <Card className="max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50" >
                <CardBody className="text-center py-16">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto">
                      <FiShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">0</span>
                    </div>
                  </div>
                  <Typography variant="h5" color="blue-gray" className="mb-3 font-bold" >
                    No Orders Yet
                  </Typography>
                  <Typography className="text-gray-600 mb-6 leading-relaxed" >
                    Start your culinary journey by exploring our delicious menu and placing your first order.
                  </Typography>
                  <Button
                    color="blue"
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => router.push('/menu-page')}
                   
                  >
                    Explore Menu
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-8">
                {orders.map((order, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden shadow-xl border-0 bg-gradient-to-r from-white to-gray-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  
                  >
                    <CardBody className="p-8" >
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">#{order.orderId ? order.orderId.slice(-4) : '----'}</span>
                            </div>
                            <div>
                              <Typography variant="h5" color="blue-gray" className="font-bold" >
                                Order #{order.orderId}
                              </Typography>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FiClock className="h-4 w-4" />
                                  <Typography variant="small" className="font-medium" >
                                    {new Date(order.orderTime).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </Typography>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <FiPhone className="h-4 w-4" />
                                  <Typography variant="small" className="font-medium" >
                                    {order.phoneNumber}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Chip
                          value={order.status.charAt(0).toUpperCase() + order.status.slice(1)} // Capitalize first letter
                          color={
                            order.status === "pending" ? "orange" :
                              order.status === "confirmed" ? "blue" :
                                order.status === "completed" ? "green" :
                                  order.status === "cancelled" ? "red" :
                                    "gray"
                          }
                          className={`font-bold px-4 py-2`}
                          icon={
                            order.status === "completed" ? <FiCheckCircle className="h-4 w-4" /> :
                              order.status === "pending" ? <FiClock className="h-4 w-4" /> :
                                order.status === "confirmed" ? <FiShoppingBag className="h-4 w-4" /> :
                                  order.status === "cancelled" ? <FiPackage className="h-4 w-4" /> :
                                    null
                          }
                        />

                      </div>

                      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 mb-6 border border-gray-100">
                        <Typography variant="h6" color="blue-gray" className="mb-4 font-bold" >
                          Order Items
                        </Typography>
                        <div className="space-y-3">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-bold text-sm">{item.quantity}</span>
                                </div>
                                <div>
                                  <Typography color="blue-gray" className="font-semibold" >
                                    {item.name}
                                  </Typography>
                                </div>
                              </div>
                              <Typography color="blue-gray" className="font-bold" >
                                ₹{item.price}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                          Total Amount
                        </Typography>
                        <Typography variant="h5" color="blue" className="font-bold" >
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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
} 