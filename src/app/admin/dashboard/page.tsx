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
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Chip,
  Progress,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Drawer,
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
  FiLogOut,
  FiUser,
  FiCalendar,
  FiBell,
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


interface DashboardStats {
  totalOrders: number;
  revenue: number;
  activeUsers: number;
  pendingOrders: number;
  visitorCount: number;
  popularItems: Array<{
    name: string;
    orders: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    items: Array<{
      _id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    status: string;
    tableId?: string;
    createdAt: string;
  }>;
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
const socket = io('http://localhost:5000');
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
  const materialProps = {
    placeholder: "",
    onResize: () => { },
    onResizeCapture: () => { },
    onPointerEnterCapture: () => { },
    onPointerLeaveCapture: () => { },
  };

  const fetchStats = async () => {
    try {
      const [statsRes, recentOrdersRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats'),
        fetch('http://localhost:5000/api/orders/recent'),
      ]);

      if (!statsRes.ok || !recentOrdersRes.ok) throw new Error('Failed to fetch data');

      const statsData = await statsRes.json();
      const recentData = await recentOrdersRes.json();

      // ✅ extract the actual array
      const recentOrders = Array.isArray(recentData.orders)
  ? recentData.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  : [];

      setStats(prev => ({
        ...prev,
        ...statsData,
        recentOrders,
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <IconButton
                variant="text"
                className="mr-2 lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                placeholder=""
                color="blue-gray"
                onResize={() => { }}
                onResizeCapture={() => { }}
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
              >
                <MenuIcon className="h-6 w-6" />
              </IconButton>
              <FiCoffee className="h-8 w-8 text-blue-500" />
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hidden sm:block">
                Tastoria Cafe Admin
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <IconButton
                variant="text"
                className="rounded-full"
                placeholder=""
                color="blue-gray"
                onResize={() => { }}
                onResizeCapture={() => { }}
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
              >
                <FiBell className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
              <Menu>
                <MenuHandler>
                  <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-2 rounded-full py-0.5 pr-2"
                    placeholder=""
                    onResize={() => { }}
                    onResizeCapture={() => { }}
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                  >
                    <Avatar
                      size="sm"
                      variant="circular"
                      alt="Admin"
                      className="border border-gray-200 p-0.5"
                      src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
                      placeholder=""
                      onResize={() => { }}
                      onResizeCapture={() => { }}
                      onPointerEnterCapture={() => { }}
                      onPointerLeaveCapture={() => { }}
                    />
                    <FiChevronDown className="h-4 w-4 hidden sm:block" />
                  </Button>
                </MenuHandler>
                <MenuList
                  className="p-1"
                  placeholder=""
                  onResize={() => { }}
                  onResizeCapture={() => { }}
                  onPointerEnterCapture={() => { }}
                  onPointerLeaveCapture={() => { }}
                >
                  <MenuItem
                    className="flex items-center gap-2"
                    placeholder=""
                    onResize={() => { }}
                    onResizeCapture={() => { }}
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                  >
                    <FiUser className="h-4 w-4" /> Profile
                  </MenuItem>
                  <MenuItem
                    className="flex items-center gap-2"
                    placeholder=""
                    onResize={() => { }}
                    onResizeCapture={() => { }}
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                  >
                    <FiSettings className="h-4 w-4" /> Settings
                  </MenuItem>
                  <hr className="my-2" />
                  <MenuItem
                    className="flex items-center gap-2 text-red-500"
                    onClick={handleSignOut}
                    placeholder=""
                    onResize={() => { }}
                    onResizeCapture={() => { }}
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                  >
                    <FiLogOut className="h-4 w-4" /> Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <Drawer
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        className="p-4"
        placement="left"
        overlay={true}
        placeholder=""
        onResize={() => { }}
        onResizeCapture={() => { }}
        onPointerEnterCapture={() => { }}
        onPointerLeaveCapture={() => { }}
      >
        <div className="flex items-center justify-between mb-6">
          <Typography
            variant="h5"
            color="blue-gray"
            placeholder=""
            onResize={() => { }}
            onResizeCapture={() => { }}
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          >
            Menu
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setIsMobileMenuOpen(false)}
            placeholder=""
            onResize={() => { }}
            onResizeCapture={() => { }}
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
          >
            <FiX className="h-5 w-5" />
          </IconButton>
        </div>
        <List {...materialProps}>
          <Link href="/admin/dashboard/menu" onClick={() => setIsMobileMenuOpen(false)}>
            <ListItem {...materialProps}>
              <ListItemPrefix {...materialProps}>
                <MenuIcon className="h-5 w-5" />
              </ListItemPrefix>
              Menu Management
            </ListItem>
          </Link>
          <Link href="/admin/dashboard/orders" onClick={() => setIsMobileMenuOpen(false)}>
            <ListItem {...materialProps}>
              <ListItemPrefix {...materialProps}>
                <FiCoffee className="h-5 w-5" />
              </ListItemPrefix>
              Order Management
            </ListItem>
          </Link>
          <Link href="/admin/dashboard/analytics" onClick={() => setIsMobileMenuOpen(false)}>
            <ListItem {...materialProps}>
              <ListItemPrefix {...materialProps}>
                <FiPieChart className="h-5 w-5" />
              </ListItemPrefix>
              Analytics
            </ListItem>
          </Link>
          <Link href="/admin/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)}>
            <ListItem {...materialProps}>
              <ListItemPrefix {...materialProps}>
                <FiSettings className="h-5 w-5" />
              </ListItemPrefix>
              Settings
            </ListItem>
          </Link>
        </List>
      </Drawer>

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
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30" {...materialProps}>
              <CardBody className="p-3 sm:p-4" {...materialProps}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-white/20 rounded-lg">
                    <FiShoppingBag className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="small" className="font-normal text-white/70 text-xs sm:text-sm" {...materialProps}>
                      Total Orders
                    </Typography>
                    <Typography variant="h6" className="text-white font-bold text-base sm:text-lg" {...materialProps}>
                      {stats.totalOrders}
                    </Typography>
                  </div>
                </div>
                <div className="mt-2 sm:mt-4 flex items-center gap-1 text-xs sm:text-sm">
                  <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white/70" />
                  <Typography variant="small" className="text-white/70" {...materialProps}>
                    +12% from last month
                  </Typography>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/30" {...materialProps}>
              <CardBody className="p-3 sm:p-4" {...materialProps}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-white/20 rounded-lg">
                    <FiDollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="small" className="font-normal text-white/70 text-xs sm:text-sm" {...materialProps}>
                      Revenue
                    </Typography>
                    <Typography variant="h6" className="text-white font-bold text-base sm:text-lg" {...materialProps}>
                      ₹{stats.revenue}
                    </Typography>
                  </div>
                </div>
                <div className="mt-2 sm:mt-4 flex items-center gap-1 text-xs sm:text-sm">
                  <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white/70" />
                  <Typography variant="small" className="text-white/70" {...materialProps}>
                    +8% from last month
                  </Typography>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30" {...materialProps}>
              <CardBody className="p-3 sm:p-4" {...materialProps}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-white/20 rounded-lg">
                    <FiClock className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="small" className="font-normal text-white/70 text-xs sm:text-sm" {...materialProps}>
                      Pending Orders
                    </Typography>
                    <Typography variant="h6" className="text-white font-bold text-base sm:text-lg" {...materialProps}>
                      {stats.pendingOrders}
                    </Typography>
                  </div>
                </div>
                <div className="mt-2 sm:mt-4">
                  <Progress value={60} size="sm" color="blue-gray" {...materialProps} />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30" {...materialProps}>
              <CardBody className="p-3 sm:p-4" {...materialProps}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 sm:p-3 bg-white/20 rounded-lg">
                    <FiUsers className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="small" className="font-normal text-white/70 text-xs sm:text-sm" {...materialProps}>
                      Active Users
                    </Typography>
                    <Typography variant="h6" className="text-white font-bold text-base sm:text-lg" {...materialProps}>
                      {stats.activeUsers}
                    </Typography>
                  </div>
                </div>
                <div className="mt-2 sm:mt-4 flex items-center gap-1 text-xs sm:text-sm">
                  <FiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white/70" />
                  <Typography variant="small" className="text-white/70" {...materialProps}>
                    +15% new users
                  </Typography>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            variants={itemVariants}
          >
            <Link href="/admin/dashboard/menu">
              <Card className="hover:shadow-lg transition-shadow h-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200" {...materialProps}>
                <CardBody className="flex flex-col items-center text-center p-3 sm:p-4" {...materialProps}>
                  <div className="p-2 sm:p-3 bg-blue-500 rounded-full mb-2 sm:mb-3 shadow-lg">
                    <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <Typography variant="h6" color="blue-gray" className="mb-1 text-sm sm:text-base font-bold" {...materialProps}>
                    Menu
                  </Typography>
                  <Typography variant="small" color="gray" className="text-xs sm:text-sm" {...materialProps}>
                    Manage Items
                  </Typography>
                </CardBody>
              </Card>
            </Link>

            <Link href="/admin/dashboard/orders">
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100 border border-green-200" {...materialProps}>
                <CardBody className="flex flex-col items-center text-center p-3 sm:p-4" {...materialProps}>
                  <div className="p-2 sm:p-3 bg-green-500 rounded-full mb-2 sm:mb-3 shadow-lg">
                    <FiCoffee className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <Typography variant="h6" color="blue-gray" className="mb-1 text-sm sm:text-base font-bold" {...materialProps}>
                    Order Management
                  </Typography>
                  <Typography variant="small" color="gray" className="text-xs sm:text-sm" {...materialProps}>
                    Monitor and manage table orders
                  </Typography>
                </CardBody>
              </Card>
            </Link>

            <Link href="/admin/dashboard/analytics">
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200" {...materialProps}>
                <CardBody className="flex flex-col items-center text-center p-3 sm:p-4" {...materialProps}>
                  <div className="p-2 sm:p-3 bg-purple-500 rounded-full mb-2 sm:mb-3 shadow-lg">
                    <FiPieChart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <Typography variant="h6" color="blue-gray" className="mb-1 text-sm sm:text-base font-bold" {...materialProps}>
                    Analytics
                  </Typography>
                  <Typography variant="small" color="gray" className="text-xs sm:text-sm" {...materialProps}>
                    View detailed business insights
                  </Typography>
                </CardBody>
              </Card>
            </Link>

            <Link href="/admin/dashboard/settings">
              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200" {...materialProps}>
                <CardBody className="flex flex-col items-center text-center p-3 sm:p-4" {...materialProps}>
                  <div className="p-2 sm:p-3 bg-amber-500 rounded-full mb-2 sm:mb-3 shadow-lg">
                    <FiSettings className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <Typography variant="h6" color="blue-gray" className="mb-1 text-sm sm:text-base font-bold" {...materialProps}>
                    Settings
                  </Typography>
                  <Typography variant="small" color="gray" className="text-xs sm:text-sm" {...materialProps}>
                    Configure system preferences
                  </Typography>
                </CardBody>
              </Card>
            </Link>
          </motion.div>

          {/* Management Section */}
          <motion.div
            className="mt-4 sm:mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
            variants={itemVariants}
          >
            
           {/* Recent Orders */}
           <Card className="lg:col-span-2 overflow-hidden bg-white shadow-xl border border-gray-100" {...materialProps}>
              <CardBody className="p-3 sm:p-4" {...materialProps}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <Typography variant="h6" color="blue-gray" className="text-base sm:text-lg font-bold" {...materialProps}>
                    Recent Orders
                  </Typography>
                  <Link href="/admin/dashboard/orders">
                    <Button size="sm" variant="text" className="flex items-center gap-1 p-1 sm:p-2 text-sm" {...materialProps}>
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
                    </Button>
                  </Link>
                </div>
                <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <List {...materialProps}>
                    {stats.recentOrders.length === 0 ? (
                      <Typography variant="small" color="gray" {...materialProps}>
                        No recent orders
                      </Typography>
                    ) : (
                      stats.recentOrders.map((order, index) => (
                        <Card
                          key={order.id || index}
                          className="w-full mb-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                          {...materialProps}
                        >
                          <CardBody className="p-4 space-y-2" {...materialProps}>
                            <div className="flex justify-between items-center">
                              <Typography variant="h6" color="blue-gray" className="font-bold" {...materialProps}>
                                Order #{index + 1}
                              </Typography>
                              <Chip
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

                            <Typography className="text-sm text-gray-700" {...materialProps}>
                              <span className="font-medium">Table:</span> {order.tableId || "N/A"}
                            </Typography>

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

                            <Typography className="text-sm font-bold text-gray-900" {...materialProps}>
                              Total: ₹{order.total}
                            </Typography>
                            <Typography className="text-xs text-gray-500" {...materialProps}>
                              Placed {dayjs(order.createdAt).fromNow()} ({dayjs(order.createdAt).format('MMM D, h:mm A')})
                            </Typography>
                          </CardBody>
                        </Card>
                      ))
                    )}
                  </List>
                </div>
              </CardBody>
            </Card>
            {/* Popular Items */}
            <Card className="bg-white shadow-xl border border-gray-100" {...materialProps}>
              <CardBody className="p-4" {...materialProps}>
                <Typography variant="h6" color="blue-gray" className="mb-4 font-bold" {...materialProps}>
                  Popular Items
                </Typography>
                <List {...materialProps}>
                  {stats.popularItems?.map((item, index) => (
                    <ListItem key={index} className="mb-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100" {...materialProps}>
                      <div className="flex w-full justify-between items-center flex-wrap gap-2">
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-bold" {...materialProps}>
                            {item.name}
                          </Typography>
                          <Typography variant="small" color="gray" {...materialProps}>
                            {item.orders} orders
                          </Typography>
                        </div>
                        <Typography variant="small" color="blue" className="font-bold" {...materialProps}>
                          ₹{item.revenue}
                        </Typography>
                      </div>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 