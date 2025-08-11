"use client";

import { Navbar, Footer } from "@/components";
import { MenuItemCard } from "@/components/menu-item-card";
import {
  Typography,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from "socket.io-client";
import Loading from "@/components/Loading";

const VALID_TABLES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const STORAGE_KEY_PREFIX = 'table_';
const MAX_CART_ITEMS = 50;

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

const cartStorage = {
  save: (tableId: string, cart: any[]): boolean => {
    try {
      const minimalCart = cart.map(item => ({
        name: item.name,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price,
        quantity: item.quantity
      }));

      if (minimalCart.length > MAX_CART_ITEMS) {
        toast.error(`Cart cannot exceed ${MAX_CART_ITEMS} items`);
        return false;
      }

      const storageKey = `${STORAGE_KEY_PREFIX}${tableId}_cart`;
      const cartString = JSON.stringify(minimalCart);

      try {
        localStorage.setItem(storageKey, cartString);
        return true;
      } catch {
        cartStorage.cleanupOldCarts();
        try {
          localStorage.setItem(storageKey, cartString);
          return true;
        } catch {
          toast.error('Unable to update cart. Please place your order.');
          return false;
        }
      }
    } catch (e) {
      console.error('Cart save error:', e);
      return false;
    }
  },

  load: (tableId: string): CartItem[] => {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${tableId}_cart`;
      const savedCart = localStorage.getItem(storageKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Cart load error:', e);
      return [];
    }
  },

  cleanupOldCarts: () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_KEY_PREFIX) && key.endsWith('_cart')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error('Cleanup error:', e);
    }
  }
};

export default function TableMenu() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;

  const [cart, setCart] = useState<any[]>([]);
  const [isValidTable, setIsValidTable] = useState(false);
  const [menuData, setMenuData] = useState<{ [category: string]: any[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const CLOUDINARY_BASE_URL = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || '';

  const getImageUrl = (item: any) => {
    if (item.imageUrl) return item.imageUrl;
    if (item.image) return `${CLOUDINARY_BASE_URL}${item.image}`;
    return "https://images.unsplash.com/photo-1504674900240-9c69d0c2e5b7?w=500&h=300&fit=crop&crop=center";
  };

  const filteredMenu = useMemo(() => {
    const filtered = Object.entries(menuData).filter(([category]) =>
      selectedCategory === 'all' || category === selectedCategory
    ) as [string, any[]][];

    return filtered.map(([category, items]) => [
      category,
      items
        .filter((item: any) => !item.paused)
        .filter((item: any) =>
          !searchQuery ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ]) as [string, any[]][];
  }, [menuData, selectedCategory, searchQuery]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5001/api/menu/all");
        const data = await res.json();

        if (data.success) {
          const grouped: { [key: string]: any[] } = {};
          data.items.forEach((item: any) => {
            const cat = item.category || "others";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
          });
          setMenuData(grouped);
        } else {
          toast.error("Failed to fetch menu");
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
        toast.error("Error loading menu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("menuStatusChanged", ({ itemId, paused }) => {
      setMenuData((prevMenu) => {
        const updatedMenu = { ...prevMenu };
        for (const category in updatedMenu) {
          updatedMenu[category] = updatedMenu[category].map((item) => {
            if (item._id === itemId) {
              return { ...item, paused };
            }
            return item;
          });
        }
        return updatedMenu;
      });

      if (paused) {
        toast.error("An item was paused and is no longer available.");
      } else {
        toast.success("An item was resumed and is now available.");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!VALID_TABLES.includes(tableId)) {
      toast.error('Invalid table number');
      router.push('/');
      return;
    }
    setIsValidTable(true);

    const savedCart = cartStorage.load(tableId);
    // This check is fine, as it just loads the initial cart state
    if (savedCart.length > 0) {
      setCart(savedCart);
    }
  }, [tableId, router]);

  const handleAddToCart = (item: any, quantity: number) => {
    let added = false;

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.name === item.name);
      let newCart;

      if (existingItemIndex > -1) {
        newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
      } else {
        newCart = [...prevCart, { ...item, quantity }];
      }

      if (cartStorage.save(tableId, newCart)) {
        added = true;
      }
      return newCart;
    });
  };

  const cartTotal = useMemo(() =>
    cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [cart]
  );

  const handleChipClick = (category: string) => {
    setSelectedCategory(category);
  };

  if (!isValidTable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="pt-24 pb-32 px-4 md:px-8">
          <div className="container mx-auto">
            {/* Table Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-8 bg-white shadow-lg border border-blue-50">
                <CardBody>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{tableId}</span>
                        </div>
                        <Typography variant="h3" color="blue-gray" className="font-bold">
                          Table {tableId}
                        </Typography>
                      </div>
                      <Typography variant="lead" color="gray" className="font-normal">
                        Welcome! Ready to order?
                      </Typography>
                    </div>
                    {/* The conditional wrapper has been removed here */}
                    <Button
                      color="blue"
                      size="lg"
                      onClick={() => router.push(`/table/${tableId}/cart`)}
                      className="flex items-center gap-3 px-6"
                    >
                      <span>View Cart</span>
                      <div className="flex items-center gap-2 bg-white text-blue-500 px-3 py-1 rounded-full">
                        <span className="text-sm font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        <span className="text-sm">items</span>
                      </div>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Search & Filter */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                  <div
                    onClick={() => handleChipClick('all')}
                    className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === 'all' ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-gray-50 text-gray-700 hover:bg-blue-gray-100'}`}
                  >
                    All
                  </div>
                  {Object.keys(menuData).map((category: string) => (
                    <div
                      key={category}
                      onClick={() => handleChipClick(category)}
                      className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-gray-50 text-gray-700 hover:bg-blue-gray-100'}`}
                    >
                      {category.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            {isLoading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
                <Loading />
                <Typography variant="h6" color="gray">Loading menu...</Typography>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory + searchQuery}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredMenu.map(([category, items]) => items.length > 0 && (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-12"
                    >
                      <Typography variant="h4" color="blue-gray" className="font-bold mb-8 pb-4 border-b-2 border-gray-200 capitalize flex items-center">
                        {category.replace(/_/g, " ")}
                        <span className="ml-3 text-sm text-gray-500 font-normal">
                          ({items.length} items)
                        </span>
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.filter(item => !item.paused).map((item, index) => {
                          const imageUrl = getImageUrl(item);
                          return (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <MenuItemCard
                                {...item}
                                price={`₹${item.price}`}
                                img={imageUrl}
                                onAddToCart={(quantity) => handleAddToCart(item, quantity)}
                              />
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}

                  {filteredMenu.every(([_, items]) => items.length === 0) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                      <Typography variant="h6" color="gray">No menu items found</Typography>
                      <Typography color="gray" className="mt-2">Try adjusting your search or filters</Typography>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </>
  );
}