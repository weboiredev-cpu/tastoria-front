"use client";

import { Navbar } from "@/components";
import { MenuItemCard } from "@/components/menu-item-card";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { FiSearch } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/all`);
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
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`);

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

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category || 'all');
  };

  const handleAddToCart = (item: any, quantity: number) => {
    const itemPrice = typeof item.price === 'string'
      ? parseFloat(item.price.replace(/[^\d.]/g, ''))
      : item.price;

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.name === item.name);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        // ✅ Fixed the typo here
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...item, price: itemPrice, quantity }];
      }
    });
  };

  const getImageUrl = (item: any) => {
    if (item.imageUrl) return item.imageUrl;
    if (item.image) return `${CLOUDINARY_BASE_URL}${item.image}`;
    return "https://images.unsplash.com/photo-1504674900240-9c69d0c2e5b7?w=500&h=300&fit=crop&crop=center";
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="pt-24 pb-32 px-4 md:px-8">
          <div className="container mx-auto">
            {/* Menu Header and Cart Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                className="mb-8 bg-white shadow-lg border border-blue-50"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
              >
                <CardBody
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                >
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                      <Typography
                        variant="h3"
                        color="blue-gray"
                        className="font-bold"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                      >
                        Our Delicious Menu
                      </Typography>
                      <Typography
                        variant="lead"
                        color="gray"
                        className="font-normal"
                        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                      >
                        Explore our wide variety of mouth-watering dishes, prepared with the finest ingredients and love.
                      </Typography>
                    </div>
                    <Button
                      color="blue"
                      size="lg"
                      onClick={() => router.push(`/cart`)}
                      className="flex items-center gap-3 px-6"
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                    >
                      <span>View Cart</span>
                      <div className="flex items-center gap-2 bg-white text-blue-500 px-3 py-1 rounded-full">
                        <span className="text-sm font-bold">{totalItemsInCart}</span>
                        <span className="text-sm">items</span>
                      </div>
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
              className="mb-8 p-4 rounded-xl shadow-lg bg-white/90 border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-1/2 lg:w-1/2">
                  <Input
                    label="Search by name"
                    icon={<FiSearch />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    crossOrigin={undefined}
                    onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                  />
                </div>
                <div className="w-full md:w-1/2 lg:w-1/2">
                  <Select
                    label="Filter by category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                  >
                    <Option value="all">All Categories</Option>
                    {Object.keys(menuData).map((category) => (
                      <Option key={category} value={category} className="capitalize">
                        {category.replace(/_/g, " ")}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </motion.div>

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
                    <Typography
                      variant="h2"
                      color="blue-gray"
                      className="text-3xl font-bold mb-8 pb-4 border-b-2 border-gray-200 capitalize"
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                    >
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
                    <Typography
                      variant="h4"
                      color="blue-gray"
                      className="mb-2"
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                    >
                      No dishes found
                    </Typography>
                    <Typography
                      color="gray"
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                    >
                      Try adjusting your search or selecting a different category.
                    </Typography>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* FIXED CART BAR */}
        {cart.length > 0 && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <Card
              className="w-full rounded-none border-t border-gray-200 bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              <div className="container mx-auto px-4">
                <CardBody
                  className="p-3 md:p-4"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 text-white rounded-md h-8 w-8 flex items-center justify-center text-sm font-bold">
                        {totalItemsInCart}
                      </div>
                      <div>
                        <Typography
                          color="blue-gray"
                          className="font-bold"
                          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                        >
                          ₹{cartTotal.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                        >
                          {totalItemsInCart} item{totalItemsInCart > 1 ? 's' : ''} in cart
                        </Typography>
                      </div>
                    </div>
                    <Button
                      color="blue"
                      onClick={() => router.push(`/cart`)}
                      className="flex-shrink-0 flex items-center gap-2"
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                    >
                      <span>View Cart</span>
                      <FaShoppingCart />
                    </Button>
                  </div>
                </CardBody>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </>
  );
}