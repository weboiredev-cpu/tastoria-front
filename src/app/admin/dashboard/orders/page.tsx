"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";
import  Loading  from "@/components/Loading"
// --- INLINE ASSETS & ICONS ---
// Icons have been updated to be more contextually appropriate.

const FiRefreshCw = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
);
const FiFilter = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);
const FiUser = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const FiPhone = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const FiMail = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);
const FiShoppingBag = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);
const FiCheckCircle = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const FiClock = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const FiX = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconTable = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 8.25A2.25 2.25 0 0 1 4.25 6h15.5A2.25 2.25 0 0 1 22 8.25V18a2.25 2.25 0 0 1-2.25 2.25H4.25A2.25 2.25 0 0 1 2 18V8.25Z"/><path d="M7 15V6.75"/><path d="M17 15V6.75"/><path d="M2 12h20"/></svg>
);
// UPDATED: New icon for "Source" filter
const IconSource = ({ className = "h-4 w-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);
const IconStatus = ({ className = "h-4 w-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
);
const IconRupee = ({ className = "h-8 w-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 3h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6"/><path d="M6 13L20 13"/><path d="M6 13L20 21"/></svg>
);


// --- INTERFACE ---
interface Order {
  _id: string;
  tableId: string | number;
  customerName: string;
  phoneNumber: string;
  userEmail?: string;
  source?: string;
  items: Array<{ name: string; price: number; quantity: number; }>;
  total: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  orderTime: string;
}

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

// --- MAIN COMPONENT ---
export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndRefresh = () => {
    setSelectedTable("all");
    setSelectedStatus("all");
    setSelectedSource("all");
    fetchOrders();
    toast.success("Filters reset and orders refreshed");
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update order status");
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
    socket.on("new-order", (newOrder: Order) => {
      setOrders((prev) => [newOrder, ...prev]);
      toast.success("🛎️ New Order Received");
    });
    socket.on("order-updated", (updatedOrder: Order) => {
      setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
      toast.success("Order status updated");
    });
    return () => {
      socket.off("new-order");
      socket.off("order-updated");
    };
  }, []);

  const getStatusStyles = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-orange-100 text-orange-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending": return <FiClock className="h-4 w-4" />;
      case "confirmed": return <FiShoppingBag className="h-4 w-4" />;
      case "completed": return <FiCheckCircle className="h-4 w-4" />;
      case "cancelled": return <FiX className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const filteredOrders = orders.filter(order => 
    (selectedTable === "all" || String(order.tableId) === selectedTable) &&
    (selectedStatus === "all" || order.status === selectedStatus) &&
    (selectedSource === "all" || order.source === selectedSource)
  );

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const totalRevenue = orders.filter(o => o.status === "completed").reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 sm:py-8 font-sans">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <FiShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Orders Management</h1>
            <p className="max-w-2xl mx-auto text-gray-600">Monitor and manage all restaurant orders in real-time</p>
          </header>

          <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-xl p-4 text-center transform hover:scale-105 transition-transform duration-300">
              <FiShoppingBag className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalOrders}</p><p className="text-sm">Total Orders</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg rounded-xl p-4 text-center transform hover:scale-105 transition-transform duration-300">
              <FiClock className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{pendingOrders}</p><p className="text-sm">Pending Orders</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg rounded-xl p-4 text-center transform hover:scale-105 transition-transform duration-300">
              <FiCheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{completedOrders}</p><p className="text-sm">Completed Orders</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg rounded-xl p-4 text-center transform hover:scale-105 transition-transform duration-300">
              <IconRupee className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">₹{totalRevenue}</p><p className="text-sm">Total Revenue</p>
            </div>
          </section>

          <div className="mb-6 sm:mb-8 shadow-lg border-0 bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2"><FiFilter className="h-5 w-5 text-blue-500" /><h2 className="font-bold text-gray-700">Filters</h2></div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <IconTable className="h-5 w-5 text-gray-500" />
                  <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)} className="min-w-[150px] p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Tables</option>
                     {[...Array(30)].map((_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        Table {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <IconSource className="h-5 w-5 text-gray-500" />
                   <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)} className="min-w-[150px] p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Sources</option>
                    <option value="website">Website</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <IconStatus className="h-5 w-5 text-gray-500" />
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="min-w-[150px] p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button onClick={handleResetAndRefresh} className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"><FiRefreshCw className="h-5 w-5" /></button>
              </div>
            </div>
          </div>

          <main>
            {loading ? (
             <div className="h-screen flex items-start justify-center">
             <Loading />
           </div>
           
            ) : 
            filteredOrders.length === 0 ? (
              <div className="max-w-md mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-xl text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6"><FiShoppingBag className="h-12 w-12 text-gray-400" /></div>
                <h3 className="mb-3 font-bold text-xl text-gray-800">No Orders Found</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{orders.length === 0 ? "No orders have been placed yet." : "No orders match the current filters."}</p>
                {(selectedTable !== "all" || selectedStatus !== "all" || selectedSource !== "all") && (
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={() => {setSelectedTable("all"); setSelectedStatus("all"); setSelectedSource("all");}}>Clear Filters</button>
                )}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {filteredOrders.map((order, index) => (
                  <div key={order._id} className="overflow-hidden shadow-xl border-0 bg-gradient-to-r from-white to-gray-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 rounded-xl" style={{ animation: `fadeInUp 0.6s ease-out forwards ${index * 100}ms` }}>
                    <div className="p-4 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4 sm:mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0"><span className="text-white font-bold text-lg">#{String(order._id).slice(-4)}</span></div>
                            <div>
                              <h3 className="font-bold text-xl sm:text-2xl text-gray-800">Order #{String(order._id).slice(-6)}</h3>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                                <div className="flex items-center gap-2 text-gray-600 text-sm"><FiClock className="h-4 w-4" /><span className="font-medium whitespace-nowrap">{formatDate(order.orderTime)}</span></div>
                                <div className="flex items-center gap-2 text-gray-600 text-sm"><IconTable className="h-4 w-4" /><span className="font-medium">Table {order.tableId}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`inline-flex items-center gap-2 font-bold px-4 py-2 self-start sm:self-auto rounded-full text-sm ${getStatusStyles(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-100">
                          <h4 className="mb-4 font-bold flex items-center gap-2 text-gray-700"><FiUser className="h-5 w-5" />Customer Details</h4>
                          <div className="space-y-2 text-sm">
                            <p className="flex items-center gap-2 text-gray-700"><FiUser className="h-4 w-4 text-blue-500" /><span className="font-semibold">Name:</span> {order.customerName}</p>
                            <p className="flex items-center gap-2 text-gray-700"><FiPhone className="h-4 w-4 text-blue-500" /><span className="font-semibold">Phone:</span> {order.phoneNumber}</p>
                            {order.userEmail && (<p className="flex items-center gap-2 text-gray-700"><FiMail className="h-4 w-4 text-blue-500" /><span className="font-semibold">Email:</span> {order.userEmail}</p>)}
                            <p className="flex items-center gap-2 text-gray-700"><IconTable className="h-4 w-4 text-blue-500" /><span className="font-semibold">Table:</span> {order.tableId}</p>
                            <p className="flex items-center gap-2 text-gray-700"><IconSource className="h-4 w-4 text-blue-500" /><span className="font-semibold">Source:</span> {order.source === 'whatsapp' ? 'WhatsApp' : 'Website'}</p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 sm:p-6 border border-gray-100">
                          <h4 className="mb-4 font-bold flex items-center gap-2 text-gray-700"><FiShoppingBag className="h-5 w-5" />Order Items</h4>
                          <div className="space-y-3">
                            {order.items.map((item, itemIndex) => (<div key={itemIndex} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shrink-0"><span className="text-blue-600 font-bold text-sm">{item.quantity}</span></div><div><p className="font-semibold text-gray-800">{item.name}</p></div></div><p className="font-bold text-gray-800">₹{item.price * item.quantity}</p></div>))}
                            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"><h5 className="font-bold text-gray-800">Total Amount</h5><p className="font-bold text-blue-600 text-lg">₹{order.total}</p></div>
                          </div>
                        </div>
                      </div>
                      {order.status === "pending" && (
                        <div className="flex gap-3 mt-6">
                          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-bold py-2 px-4 rounded-lg" onClick={() => updateOrderStatus(order._id, "confirmed")}>Confirm Order</button>
                          <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-bold py-2 px-4 rounded-lg" onClick={() => updateOrderStatus(order._id, "cancelled")}>Cancel Order</button>
                        </div>
                      )}
                      {order.status === "confirmed" && (
                        <div className="flex gap-3 mt-6">
                          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transform hover:scale-105 transition-all duration-300 text-white font-bold py-2 px-4 rounded-lg" onClick={() => updateOrderStatus(order._id, "completed")}>Mark as Completed</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
