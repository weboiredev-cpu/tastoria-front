"use client";

import { Navbar, Footer } from "@/components";
import { MenuItemCard } from "@/components/menu-item-card";
import { Typography, Button } from "@material-tailwind/react";
import Link from "next/link";
import { useState, useEffect } from "react";
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [menuData, setMenuData] = useState<{ [category: string]: any[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const CLOUDINARY_BASE_URL = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || '';

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

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5000/api/menu/all");
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
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("menuStatusChanged", ({ itemId, paused }) => {
      setMenuData((prevMenu) => {
        const updatedMenu = { ...prevMenu };

        // Update only the affected item
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

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const total = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setCartTotal(total);
  }, [cart]);

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
        return [...prevCart, {
          ...item,
          price: itemPrice,
          quantity
        }];
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Function to get proper image URL
  const getImageUrl = (item: any) => {
    // Check if item has imageUrl (from API)
    if (item.imageUrl) {
      return item.imageUrl;
    }
    
    // Check if item has image field (fallback)
    if (item.image) {
      return `${CLOUDINARY_BASE_URL}${item.image}`;
    }
    
    // Return a default placeholder image
    return "https://images.unsplash.com/photo-1504674900240-9c69d0c2e5b7?w=500&h=300&fit=crop&crop=center";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="pt-32 pb-20 px-4 md:px-8">
          <div className="container mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h1" color="blue-gray" className="text-4xl md:text-5xl font-bold mb-4" {...materialProps}>
                  Our Delicious Menu
                </Typography>
                <Typography variant="lead" className="text-gray-600 max-w-2xl mx-auto" {...materialProps}>
                  Explore our wide variety of mouth-watering dishes, prepared with the finest ingredients and love
                </Typography>
              </motion.div>
            </div>

            {/* Cart Summary - Fixed Position */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50 py-4 px-6">
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <Typography variant="small" className="font-medium text-gray-600" {...materialProps}>
                      {cart.length > 0 ? `${cart.reduce((sum, item) => sum + item.quantity, 0)} items` : 'Cart is empty'}
                    </Typography>
                    <Typography variant="h6" color="blue-gray" className="font-bold" {...materialProps}>
                      ₹{cartTotal}
                    </Typography>
                  </div>
                </div>
                <Link href="/cart">
                  <Button
                    color="green"
                    size="lg"
                    className="flex items-center gap-2"
                    {...materialProps}
                  >
                    <span>View Cart</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Category Navigation */}
            <div className="mb-12 overflow-x-auto">
              <div className="flex gap-4 pb-4">
                <div
                  onClick={() => setSelectedCategory('all')}
                  className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === 'all' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-blue-gray-50 text-gray-700 hover:bg-blue-gray-100'
                  }`}
                >
                  All
                </div>
                {Object.keys(menuData).map((category) => (
                  <div
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              /* Menu Sections */
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {Object.entries(menuData)
                  .filter(([category]) => selectedCategory === 'all' || category === selectedCategory)
                  .map(([section, items]) => (
                    <motion.div
                      className="mb-16"
                      key={section}
                      variants={itemVariants}
                    >
                      <Typography variant="h2" color="blue-gray" className="text-3xl font-bold mb-8 pb-4 border-b-2 border-gray-200 capitalize" {...materialProps}>
                        {section.replace(/_/g, " ")}
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(items as any[]).filter(item => !item.paused).map((item, index) => {
                          const imageUrl = getImageUrl(item);

                          return (
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
                                img={imageUrl}
                                onAddToCart={(quantity) => handleAddToCart(item, quantity)}
                              />
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 