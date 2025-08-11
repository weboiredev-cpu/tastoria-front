"use client";

import { Navbar, Footer } from "@/components";
import { MenuItemCard } from "@/components/menu-item-card";
import {
  Typography,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  img: string;
  description: string;
}

export default function MenuPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [menuData, setMenuData] = useState<{ [category: string]: any[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const CLOUDINARY_BASE_URL = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || '';

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5001/api/menu/all");
        const data = await res.json();

        if (data.success) {
          const grouped: { [key: string]: any[] } = {};
          data.items.forEach((item: any) => {
            if (item.paused) return;
            const cat = item.category || "others";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
          });
          setMenuData(grouped);
        } else {
          console.error("Failed to fetch menu:", data.error);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Socket listener for real-time menu status updates
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
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Update cart in localStorage and recalculate total
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);

  // Handler for category chip clicks
  const handleChipClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (item: any, quantity: number) => {
    const itemPrice = typeof item.price === 'string'
      ? parseFloat(item.price.replace(/[^\d.]/g, ''))
      : item.price;

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.name === item.name);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...item, price: itemPrice, quantity }];
      }
    });
  };

  // Function to get proper image URL
  const getImageUrl = (item: any) => {
    if (item.imageUrl) return item.imageUrl;
    if (item.image) return `${CLOUDINARY_BASE_URL}${item.image}`;
    return "https://images.unsplash.com/photo-1504674900240-9c69d0c2e5b7?w=500&h=300&fit=crop&crop=center";
  };

  // Filter data based on selected category and search query
  const filteredMenu = Object.entries(menuData)
    .map(([category, items]) => {
      if (selectedCategory !== 'all' && category !== selectedCategory) {
        return null;
      }
      const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.paused
      );
      return [category, filteredItems] as [string, any[]];
    })
    .filter((entry): entry is [string, any[]] => entry !== null && entry[1].length > 0);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="pt-24 pb-20 px-4 md:px-8">
          <div className="container mx-auto">
            {/* Menu Header and Cart Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-8 bg-white shadow-lg border border-blue-50">
                <CardBody>
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                      <Typography variant="h3" color="blue-gray" className="font-bold">
                      Our Delicious Menu
                      </Typography>
                      <Typography variant="lead" color="gray" className="font-normal">
                      Explore our wide variety of mouth-watering dishes, prepared with the finest ingredients and love.
                      </Typography>
                    </div>
                    <Button
                      color="blue"
                      size="lg"
                      onClick={() => router.push(`/cart`)}
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

            {/* Search and Filter */}
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
                    className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 md:px-4 md:py-2 md:text-sm ${
                      selectedCategory === 'all'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-blue-gray-50 text-gray-700 hover:bg-blue-gray-100'
                    }`}
                  >
                    All
                  </div>
                  {Object.keys(menuData).map((category: string) => (
                    <div
                      key={category}
                      onClick={() => handleChipClick(category)}
                      className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 md:px-4 md:py-2 md:text-sm ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-blue-gray-50 text-gray-700 hover:bg-blue-gray-100'
                      }`}
                    >
                      {category.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredMenu.map(([section, items]) => (
                  <motion.div
                    className="mb-16"
                    key={section}
                    variants={itemVariants}
                  >
                    <Typography variant="h2" color="blue-gray" className="text-3xl font-bold mb-8 pb-4 border-b-2 border-gray-200 capitalize">
                      {section.replace(/_/g, " ")}
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {items.map((item, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <MenuItemCard
                            name={item.name}
                            description={item.description}
                            price={`₹${item.price}`}
                            img={getImageUrl(item)}
                            onAddToCart={(quantity) => handleAddToCart(item, quantity)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
                {filteredMenu.length === 0 && !isLoading && (
                  <div className="text-center py-16">
                    <Typography variant="h4" color="blue-gray" className="mb-2">
                      No dishes found
                    </Typography>
                    <Typography color="gray">
                      Try adjusting your search or selecting a different category.
                    </Typography>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}