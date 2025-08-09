"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
  IconButton,
  Select,
  Option,
} from "@material-tailwind/react";
import { FiRefreshCw, FiFilter, FiTable, FiUser, FiPhone, FiMail, FiShoppingBag, FiCheckCircle, FiClock, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import io from "socket.io-client";
import Loading from "@/components/Loading";

interface Order {
  _id: string;
  tableId: string;
  customerName: string;
  phoneNumber: string;
  userEmail?: string;
  source?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  orderTime: string;
}

const socket = io("http://localhost:5000");

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");


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

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      toast.success("Order status updated");
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();

    // 🔔 When a new order is received
    socket.on("new-order", (newOrder: Order) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      toast.success("🛎️ New Order Received");
    });

    // 🔄 When an existing order is updated
    socket.on("order-updated", (updatedOrder: Order) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      toast.success("Order status updated");
    });
    return () => {
      socket.off("new-order");
      socket.off("order-updated");
    };
  }, []);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "orange";
      case "confirmed":
        return "blue";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <FiClock className="h-4 w-4" />;
      case "confirmed":
        return <FiShoppingBag className="h-4 w-4" />;
      case "completed":
        return <FiCheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <FiX className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get unique table numbers for filter
  const uniqueTables = Array.from(new Set(orders.map(order => order.tableId))).sort();

  // Filter orders based on selected table and status
  const filteredOrders = orders.filter(order => {
    const tableMatch = selectedTable === "all" || order.tableId === selectedTable;
    const statusMatch = selectedStatus === "all" || order.status === selectedStatus;
    const sourceMatch = selectedSource === "all" || order.source === selectedSource;
    return tableMatch && statusMatch && sourceMatch;
  });

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <FiShoppingBag className="h-8 w-8 text-white" />
            </div>
            <Typography variant="h2" color="blue-gray" className="mb-2 font-bold" {...materialProps}>
              Orders Management
            </Typography>
            <Typography variant="lead" color="gray" className="max-w-2xl mx-auto" {...materialProps}>
              Monitor and manage all restaurant orders in real-time
            </Typography>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300" {...materialProps}>
              <CardBody className="text-center" {...materialProps}>
                <FiShoppingBag className="h-8 w-8 mx-auto mb-3" />
                <Typography variant="h4" className="font-bold" {...materialProps}>
                  {totalOrders}
                </Typography>
                <Typography variant="small" {...materialProps}>
                  Total Orders
                </Typography>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300" {...materialProps}>
              <CardBody className="text-center" {...materialProps}>
                <FiClock className="h-8 w-8 mx-auto mb-3" />
                <Typography variant="h4" className="font-bold" {...materialProps}>
                  {pendingOrders}
                </Typography>
                <Typography variant="small" {...materialProps}>
                  Pending Orders
                </Typography>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300" {...materialProps}>
              <CardBody className="text-center" {...materialProps}>
                <FiCheckCircle className="h-8 w-8 mx-auto mb-3" />
                <Typography variant="h4" className="font-bold" {...materialProps}>
                  {completedOrders}
                </Typography>
                <Typography variant="small" {...materialProps}>
                  Completed Orders
                </Typography>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform hover:scale-105 transition-transform duration-300" {...materialProps}>
              <CardBody className="text-center" {...materialProps}>
                <FiShoppingBag className="h-8 w-8 mx-auto mb-3" />
                <Typography variant="h4" className="font-bold" {...materialProps}>
                  ₹{totalRevenue}
                </Typography>
                <Typography variant="small" {...materialProps}>
                  Total Revenue
                </Typography>
              </CardBody>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-white to-gray-50" {...materialProps}>
            <CardBody className="p-6" {...materialProps}>
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiFilter className="h-5 w-5 text-blue-500" />
                  <Typography variant="h6" color="blue-gray" className="font-bold" {...materialProps}>
                    Filters
                  </Typography>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <FiTable className="h-4 w-4 text-gray-600" />
                    <Select
                      label="Table Number"
                      value={selectedTable}
                      onChange={(value) => {
                        console.log("Select onChange value:", value);
                        if (typeof value === "string") {
                          setSelectedTable(value);
                        } else {
                          setSelectedTable("all");
                        }
                      }}



                      className="min-w-[150px]"
                      {...materialProps}
                    >
                      <Option value="all">All Tables</Option>
                      {[1, 2, 3, 4, 5, 6, 7].map(table => (
                        <Option key={table} value={table.toString()}>Table {table}</Option>
                      ))}

                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiShoppingBag className="h-4 w-4 text-gray-600" />
                    <Select
                      label="Source"
                      value={selectedSource}
                      onChange={(value) => {
                        console.log("Select Source onChange value:", value);
                        if (typeof value === "string") {
                          setSelectedSource(value);
                        } else {
                          setSelectedSource("all");
                        }
                      }}
                      className="min-w-[150px]"
                      {...materialProps}
                    >
                      <Option value="all">All Sources</Option>
                      <Option value="website">Website</Option>
                      <Option value="whatsapp">WhatsApp</Option>
                    </Select>
                  </div>


                  <div className="flex items-center gap-2">
                    <FiShoppingBag className="h-4 w-4 text-gray-600" />
                    <Select
                      label="Order Status"
                      value={selectedStatus}
                      onChange={(value) => setSelectedStatus(value || "all")}
                      className="min-w-[150px]"
                      {...materialProps}
                    >
                      <Option value="all">All Status</Option>
                      <Option value="pending">Pending</Option>
                      <Option value="confirmed">Confirmed</Option>
                      <Option value="completed">Completed</Option>
                      <Option value="cancelled">Cancelled</Option>
                    </Select>
                  </div>

                  <IconButton
                    variant="text"
                    onClick={fetchOrders}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    {...materialProps}
                  >
                    <FiRefreshCw className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            </CardBody>
          </Card>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loading />
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card className="max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50" {...materialProps}>
              <CardBody className="text-center py-16" {...materialProps}>
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-3 font-bold" {...materialProps}>
                  No Orders Found
                </Typography>
                <Typography className="text-gray-600 mb-6 leading-relaxed" {...materialProps}>
                  {orders.length === 0
                    ? "No orders have been placed yet."
                    : "No orders match the current filters. Try adjusting your selection."
                  }
                </Typography>
                {(selectedTable !== "all" || selectedStatus !== "all") && (
                  <Button
                    color="blue"
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      setSelectedTable("all");
                      setSelectedStatus("all");
                    }}
                    {...materialProps}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <Card
                  key={order._id}
                  className="overflow-hidden shadow-xl border-0 bg-gradient-to-r from-white to-gray-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                  style={{
                    animation: `fadeInUp 0.6s ease-out forwards ${index * 100}ms`
                  }}

                  {...materialProps}
                >
                  <CardBody className="p-8" {...materialProps}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">#{order._id.slice(-4)}</span>
                          </div>
                          <div>
                            <Typography variant="h5" color="blue-gray" className="font-bold" {...materialProps}>
                              Order #{order._id.slice(-6)}
                            </Typography>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiClock className="h-4 w-4" />
                                <Typography variant="small" className="font-medium" {...materialProps}>
                                  {formatDate(order.orderTime)}
                                </Typography>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <FiTable className="h-4 w-4" />
                                <Typography variant="small" className="font-medium" {...materialProps}>
                                  Table {order.tableId}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Chip
                        value={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        color={getStatusColor(order.status)}
                        className="font-bold px-4 py-2"
                        icon={getStatusIcon(order.status)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Customer Details */}
                      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                        <Typography variant="h6" color="blue-gray" className="mb-4 font-bold flex items-center gap-2" {...materialProps}>
                          <FiUser className="h-5 w-5" />
                          Customer Details
                        </Typography>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiUser className="h-4 w-4 text-blue-500" />
                            <Typography variant="small" {...materialProps}>
                              <span className="font-semibold">Name:</span> {order.customerName}
                            </Typography>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiPhone className="h-4 w-4 text-blue-500" />
                            <Typography variant="small" {...materialProps}>
                              <span className="font-semibold">Phone:</span> {order.phoneNumber}
                            </Typography>
                          </div>
                          {order.userEmail && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <FiMail className="h-4 w-4 text-blue-500" />
                              <Typography variant="small" {...materialProps}>
                                <span className="font-semibold">Email:</span> {order.userEmail}
                              </Typography>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiTable className="h-4 w-4 text-blue-500" />
                            <Typography variant="small" {...materialProps}>
                              <span className="font-semibold">Table:</span> {order.tableId}
                            </Typography>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiShoppingBag className="h-4 w-4 text-blue-500" />
                            <Typography variant="small" {...materialProps}>
                              <span className="font-semibold">Source:</span> {order.source === 'whatsapp' ? 'WhatsApp' : 'Website'}
                            </Typography>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                        <Typography variant="h6" color="blue-gray" className="mb-4 font-bold flex items-center gap-2" {...materialProps}>
                          <FiShoppingBag className="h-5 w-5" />
                          Order Items
                        </Typography>
                        <div className="space-y-3">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-bold text-sm">{item.quantity}</span>
                                </div>
                                <div>
                                  <Typography color="blue-gray" className="font-semibold" {...materialProps}>
                                    {item.name}
                                  </Typography>
                                </div>
                              </div>
                              <Typography color="blue-gray" className="font-bold" {...materialProps}>
                                ₹{item.price * item.quantity}
                              </Typography>
                            </div>
                          ))}
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                            <Typography variant="h6" color="blue-gray" className="font-bold" {...materialProps}>
                              Total Amount
                            </Typography>
                            <Typography variant="h6" color="blue" className="font-bold" {...materialProps}>
                              ₹{order.total}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {order.status === "pending" && (
                      <div className="flex gap-3 mt-6">
                        <Button
                          color="blue"
                          size="lg"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300"
                          onClick={() => updateOrderStatus(order._id, "confirmed")}
                          {...materialProps}
                        >
                          Confirm Order
                        </Button>
                        <Button
                          color="red"
                          size="lg"
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg transform hover:scale-105 transition-all duration-300"
                          onClick={() => updateOrderStatus(order._id, "cancelled")}
                          {...materialProps}
                        >
                          Cancel Order
                        </Button>
                      </div>
                    )}

                    {order.status === "confirmed" && (
                      <div className="flex gap-3 mt-6">
                        <Button
                          color="green"
                          size="lg"
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transform hover:scale-105 transition-all duration-300"
                          onClick={() => updateOrderStatus(order._id, "completed")}
                          {...materialProps}
                        >
                          Mark as Completed
                        </Button>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
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
    </div>
  );
} 