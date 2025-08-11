'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
  Chip,
  Progress,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  FiMenu as MenuIcon,
  FiUsers,
  FiSettings,
  FiShoppingBag,
  FiBarChart,
  FiClock,
  FiTrendingUp,
  FiAlertCircle,
  FiCoffee,
  FiDollarSign,
  FiPieChart,
  FiUser,
  FiCalendar,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import io from 'socket.io-client';
import Link from "next/link";
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);


// Relax material-tailwind types to avoid passing non-React DOM props
const M = {
  Card: Card as any,
  CardBody: CardBody as any,
  Typography: Typography as any,
  Button: Button as any,
  IconButton: IconButton as any,
  Chip: Chip as any,
  Progress: Progress as any,
  List: List as any,
  ListItem: ListItem as any,
  ListItemPrefix: ListItemPrefix as any,
};

interface RecentOrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
  productCategory?: string;
}

interface RecentOrder {
  id: string;
  customerName: string;
  items: RecentOrderItem[];
  total: number;
  status: string;
  tableId?: string;
  createdAt: string;
}

interface DashboardStats {
  totalOrders: number;
  revenue: number;
  activeUsers: number;
  pendingOrders: number;
  visitorCount: number;
  popularItems: Array<{
    name: string;
    category: string;
    orders: number;
    revenue?: number;
  }>;
  recentOrders: RecentOrder[];
  dailyRevenue: Array<{
    day: string;
    amount: number;
  }>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const socket = io('http://localhost:5001');
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const defaultStats: DashboardStats = {
  totalOrders: 0,
  revenue: 0,
  activeUsers: 0,
  pendingOrders: 0,
  visitorCount: 0,
  popularItems: [],
  recentOrders: [],
  dailyRevenue: []
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Material Tailwind component props for required event handlers
  const materialProps: any = {
    placeholder: "",
  };

  const fetchStats = async () => {
  try {
    const [statsRes, recentOrdersRes] = await Promise.all([
      fetch('http://localhost:5001/api/admin/stats'),
      fetch('http://localhost:5001/api/orders/recent'),
    ]);

    if (!statsRes.ok || !recentOrdersRes.ok) throw new Error('Failed to fetch data');

    const statsData = await statsRes.json();
    const recentData = await recentOrdersRes.json();

    const recentOrders: RecentOrder[] = Array.isArray(recentData.orders)
      ? (recentData.orders as RecentOrder[]).sort(
          (a: RecentOrder, b: RecentOrder) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : [];

    const itemCount: Record<string, { name: string; category: string; orders: number }> = {};

    recentOrders.forEach((order: RecentOrder) => {
      order.items.forEach((item: RecentOrderItem) => {
        const category =
          item.category ||
          item.productCategory || // fallback if backend uses another name
          'Uncategorized';

        if (!itemCount[item.name]) {
          itemCount[item.name] = {
            name: item.name,
            category,
            orders: 0
          };
        }
        itemCount[item.name].orders += item.quantity;
      });
    });

    const popularItems = Object.values(itemCount)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    setStats(prev => ({
      ...prev,
      ...statsData,
      recentOrders,
      popularItems
    }));

  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};
  
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
  
    // ✅ Listen for real-time new orders
    socket.on('new-order', (order) => {
      setStats(prev => {
        const updatedOrders = [order, ...prev.recentOrders.filter(o => o.id !== order.id)];
        updatedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return {
          ...prev,
          recentOrders: updatedOrders.slice(0, 10),
        };
      });
    });
    
  
    return () => {
      clearInterval(interval);
      socket.off('new-order');
    };
  }, []);
  

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/admin/signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Admin page uses the global admin navbar from layout.tsx */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 px-3 sm:py-6 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-6"
        >
          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            variants={itemVariants}
          >
            <M.Card className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30" {...materialProps}>
              <M.CardBody className="p-3 sm:p-4" {...materialProps}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-white/20 rounded-lg">
                    <FiShoppingBag className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <M.Typography variant="small" className="font-normal text-white/70 text-xs sm:text-sm" {...materialProps}>
                      Total Orders
                    </M.Typography>
                    <M.Typography variant="h6" className="text-white font-bold text-base sm:text-lg" {...materialProps}>
                      {stats.totalOrders}
                    </M.Typography>
                  </div>
                </div>
                <div className="mt-2 sm:mt-4 flex items-center gap-1 text-xs sm:text-sm">
                  <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white/70" />
                  <M.Typography variant="small" className="text-white/70" {...materialProps}>
                    +12% from last month
                  </M.Typography>
                </div>
              </M.CardBody>
            </M.Card>
            

            <M.Card className="bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/30" {...materialProps}>
              <M.CardBody className="p-3 sm:p-4" {...materialProps}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-white/20 rounded-lg">
                    <FiDollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <M.Typography variant="small" className="font-normal text-white/70 text-xs sm:text-sm" {...materialProps}>
                      Revenue
                    </M.Typography>
                    <M.Typography variant="h6" className="text-white font-bold text-base sm:text-lg" {...materialProps}>
                      ₹{stats.revenue}
                    </M.Typography>
                  </div>
                </div>
                <div className="mt-2 sm:mt-4 flex items-center gap-1 text-xs sm:text-sm">
                  <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white/70" />
                  <M.Typography variant="small" className="text-white/70" {...materialProps}>
                    +8% from last month
                  </M.Typography>
                </div>
              </M.CardBody>
            </M.Card>

            <M.Card className="bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30" {...materialProps}>
              <M.CardBody className="p-3 sm:p-4" {...materialProps}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-white/20 rounded-lg">
                    <FiClock className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <M.Typography variant="small" className="font-normal text-white/70 text-xs sm:text-sm" {...materialProps}>
                      Pending Orders
                    </M.Typography>
                    <M.Typography variant="h6" className="text-white font-bold text-base sm:text-lg" {...materialProps}>
                      {stats.pendingOrders}
                    </M.Typography>
                  </div>
                </div>
                <div className="mt-2 sm:mt-4">
                  <M.Progress value={60} size="sm" color="blue-gray" {...materialProps} />
                </div>
              </M.CardBody>
            </M.Card>
            

            <M.Card className="bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30" {...materialProps}>
              <M.CardBody className="p-3 sm:p-4" {...materialProps}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-white/20 rounded-lg">
                    <FiUsers className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <M.Typography variant="small" className="font-normal text-white/70 text-xs sm:text-sm" {...materialProps}>
                      Active Users
                    </M.Typography>
                    <M.Typography variant="h6" className="text-white font-bold text-base sm:text-lg" {...materialProps}>
                      {stats.activeUsers}
                    </M.Typography>
                  </div>
                </div>
                <div className="mt-2 sm:mt-4 flex items-center gap-1 text-xs sm:text-sm">
                  <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white/70" />
                  <M.Typography variant="small" className="text-white/70" {...materialProps}>
                    +15% new users
                  </M.Typography>
                </div>
              </M.CardBody>
            </M.Card>
          </motion.div>
          

          {/* Quick Actions */}
          <motion.div
            className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            variants={itemVariants}
          >
            <Link href="/admin/dashboard/menu">
              <M.Card className="hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200" {...materialProps}>
                <M.CardBody className="flex flex-col items-center text-center p-3 sm:p-4" {...materialProps}>
                  <div className="p-2 sm:p-3 bg-blue-500 rounded-full mb-2 sm:mb-3 shadow-lg">
                    <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <M.Typography variant="h6" color="blue-gray" className="mb-1 text-sm sm:text-base font-bold" {...materialProps}>
                    Menu
                  </M.Typography>
                  <M.Typography variant="small" color="gray" className="text-xs sm:text-sm" {...materialProps}>
                    Manage Items
                  </M.Typography>
                </M.CardBody>
              </M.Card>
            </Link>

            <Link href="/admin/dashboard/orders">
              <M.Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100 border border-green-200" {...materialProps}>
                <M.CardBody className="flex flex-col items-center text-center p-3 sm:p-4" {...materialProps}>
                  <div className="p-2 sm:p-3 bg-green-500 rounded-full mb-2 sm:mb-3 shadow-lg">
                    <FiCoffee className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <M.Typography variant="h6" color="blue-gray" className="mb-1 text-sm sm:text-base font-bold" {...materialProps}>
                    Order Management
                  </M.Typography>
                  <M.Typography variant="small" color="gray" className="text-xs sm:text-sm" {...materialProps}>
                    Monitor and manage table orders
                  </M.Typography>
                </M.CardBody>
              </M.Card>
            </Link>

            <Link href="/admin/dashboard/analytics">
              <M.Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200" {...materialProps}>
                <M.CardBody className="flex flex-col items-center text-center p-3 sm:p-4" {...materialProps}>
                  <div className="p-2 sm:p-3 bg-purple-500 rounded-full mb-2 sm:mb-3 shadow-lg">
                    <FiPieChart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <M.Typography variant="h6" color="blue-gray" className="mb-1 text-sm sm:text-base font-bold" {...materialProps}>
                    Analytics
                  </M.Typography>
                  <M.Typography variant="small" color="gray" className="text-xs sm:text-sm" {...materialProps}>
                    View detailed business insights
                  </M.Typography>
                </M.CardBody>
              </M.Card>
            </Link>

            <Link href="/admin/dashboard/settings">
              <M.Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200" {...materialProps}>
                <M.CardBody className="flex flex-col items-center text-center p-3 sm:p-4" {...materialProps}>
                  <div className="p-2 sm:p-3 bg-amber-500 rounded-full mb-2 sm:mb-3 shadow-lg">
                    <FiSettings className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <M.Typography variant="h6" color="blue-gray" className="mb-1 text-sm sm:text-base font-bold" {...materialProps}>
                    Settings
                  </M.Typography>
                  <M.Typography variant="small" color="gray" className="text-xs sm:text-sm" {...materialProps}>
                    Configure system preferences
                  </M.Typography>
                </M.CardBody>
              </M.Card>
            </Link>
          </motion.div>

          {/* Management Section */}
          <motion.div
            className="mt-4 sm:mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
            variants={itemVariants}
          >
            
           {/* Recent Orders */}
           <M.Card className="lg:col-span-2 overflow-hidden bg-white shadow-xl border border-gray-100" {...materialProps}>
              <M.CardBody className="p-3 sm:p-4" {...materialProps}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <M.Typography variant="h6" color="blue-gray" className="text-base sm:text-lg font-bold" {...materialProps}>
                    Recent Orders
                  </M.Typography>
                  <Link href="/admin/dashboard/orders">
                    <M.Button size="sm" variant="text" className="flex items-center gap-1 p-1 sm:p-2 text-sm" {...materialProps}>
                      <span className="hidden sm:inline">View All</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </M.Button>
                  </Link>
                </div>
                <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <M.List {...materialProps}>
                    {stats.recentOrders.length === 0 ? (
                      <M.Typography variant="small" color="gray" {...materialProps}>
                        No recent orders
                      </M.Typography>
                    ) : (
                      stats.recentOrders.map((order, index) => (
                        <M.Card
                          key={order.id || index}
                          className="w-full mb-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                          {...materialProps}
                        >
                          <M.CardBody className="p-4 space-y-2" {...materialProps}>
                            <div className="flex justify-between items-center">
                              <M.Typography variant="h6" color="blue-gray" className="font-bold" {...materialProps}>
                                Order #{index + 1}
                              </M.Typography>
                              <M.Chip
                                value={order.status}
                                size="sm"
                                className="capitalize"
                                color={
                                  order.status === "completed"
                                    ? "green"
                                    : order.status === "cancelled"
                                      ? "red"
                                      : "blue"
                                }
                              />
                            </div>

                            <M.Typography className="text-sm text-gray-700" {...materialProps}>
                              <span className="font-medium">Table:</span> {order.tableId || "N/A"}
                            </M.Typography>

                            <div className="text-sm text-gray-700">
                              <span className="font-medium">Items:</span>
                              <ul className="mt-2 space-y-2">
                                {order.items?.map((item) => (
                                  <li key={item._id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                                    <div className="flex items-center space-x-3">
                                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                                        {item.quantity}
                                      </span>
                                      <span className="font-medium text-gray-800">{item.name}</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">₹{item.price * item.quantity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <M.Typography className="text-sm font-bold text-gray-900" {...materialProps}>
                              Total: ₹{order.total}
                            </M.Typography>
                            <M.Typography className="text-xs text-gray-500" {...materialProps}>
                              Placed {dayjs(order.createdAt).fromNow()} ({dayjs(order.createdAt).format('MMM D, h:mm A')})
                            </M.Typography>
                          </M.CardBody>
                        </M.Card>
                      ))
                    )}
                  </M.List>
                </div>
              </M.CardBody>
            </M.Card>
            {/* Popular Items */}
            <M.Card className="bg-white shadow-xl border border-gray-100" >
              <M.CardBody className="p-4">
                <M.Typography variant="h6" color="blue-gray" className="mb-4 font-bold">
                  Popular Items
                </M.Typography>
                <M.List>
  {stats.popularItems?.map((item, index) => (
    <M.ListItem
      key={index}
      className="mb-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100"
    
    >
      <div className="flex w-full justify-between items-center flex-wrap gap-2">
        <div>
        <M.Typography variant="small" color="blue-gray" className="font-bold" {...materialProps}>
  {item.name} ({item.category})
</M.Typography>
          <M.Typography
            variant="small"
            color="gray"
           
          >
            {item.orders} {item.orders === 1 ? 'order' : 'orders'}
          </M.Typography>
        </div>
      </div>
    </M.ListItem>
  ))}
</M.List>

              </M.CardBody>
            </M.Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 