"use client";

// External imports remain the same...

import {
  Typography,
  Button,
  Card,
  CardBody,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Chip,
} from "@material-tailwind/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiPhone, FiUser, FiShoppingBag } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';

const VALID_TABLES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

// Cart Storage Utilities - Keep in sync with table menu page
const STORAGE_KEY_PREFIX = 'table_';
const MAX_CART_ITEMS = 50;

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

const cartStorage = {
  save: (tableId: string, cart: CartItem[]): boolean => {
    try {
      if (cart.length > MAX_CART_ITEMS) {
        toast.error(`Cart cannot exceed ${MAX_CART_ITEMS} items`);
        return false;
      }

      const storageKey = `${STORAGE_KEY_PREFIX}${tableId}_cart`;
      const cartString = JSON.stringify(cart);
      
      try {
        localStorage.setItem(storageKey, cartString);
        return true;
      } catch (e) {
        cartStorage.cleanupOldCarts();
        try {
          localStorage.setItem(storageKey, cartString);
          return true;
        } catch (e2) {
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

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function TableCart() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    if (!VALID_TABLES.includes(tableId)) {
      toast.error('Invalid table number');
      router.push('/');
      return;
    }
    const initialCart = cartStorage.load(tableId);
    setCart(initialCart);
    calculateTotal(initialCart);
  }, [tableId, router]);

  const calculateTotal = (cartItems: CartItem[]) => {
    const sum = cartItems.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
    setTotal(sum);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    if (cartStorage.save(tableId, newCart)) {
      setCart(newCart);
      calculateTotal(newCart);
      toast.success('Cart updated');
    }
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    if (cartStorage.save(tableId, newCart)) {
      setCart(newCart);
      calculateTotal(newCart);
      toast.success('Item removed from cart');
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsLoading(true);
    const order = {
      tableId,
      userEmail: session?.user?.email || "",
      items: cart,
      total,
      orderTime: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Order placed successfully!');
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${tableId}_cart`);
        router.push(`/table/${tableId}/order-success`);
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      toast.error("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              color="blue-gray"
              variant="text"
              className="flex items-center gap-2"
              onClick={() => router.push(`/table/${tableId}`)}
              {...materialProps}
            >
              <FiArrowLeft className="h-4 w-4" />
              <span>Back to Menu</span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{tableId}</span>
              </div>
              <Typography variant="h4" color="blue-gray" className="font-bold" {...materialProps}>
                Table {tableId}
              </Typography>
            </div>
          </div>

          {/* Cart Items */}
          {cart.length > 0 ? (
            <Card className="overflow-hidden shadow-lg" {...materialProps}>
              <CardBody className="p-0" {...materialProps}>
                <div className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <Typography variant="h6" color="blue-gray" className="font-medium" {...materialProps}>
                          {item.name}
                        </Typography>
                        <Typography variant="small" color="gray" className="font-normal" {...materialProps}>
                          ₹{item.price} × {item.quantity}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-4">
                        <Typography variant="h6" color="blue-gray" className="font-bold" {...materialProps}>
                          ₹{item.price * item.quantity}
                        </Typography>
                        <div className="flex items-center gap-2">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            {...materialProps}
                          >
                            <FiMinus className="h-4 w-4" />
                          </IconButton>
                          <Typography variant="h6" className="w-8 text-center" {...materialProps}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            {...materialProps}
                          >
                            <FiPlus className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            variant="text"
                            color="red"
                            size="sm"
                            onClick={() => removeItem(index)}
                            {...materialProps}
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12"
            >
              <div className="flex justify-center mb-4">
                <FiShoppingBag className="h-16 w-16 text-blue-gray-300" />
              </div>
              <Typography variant="h5" color="blue-gray" className="mb-2" {...materialProps}>
                Your cart is empty
              </Typography>
              <Typography color="gray" className="mb-6" {...materialProps}>
                Add some delicious items from the menu
              </Typography>
              <Button
                color="blue"
                onClick={() => router.push(`/table/${tableId}`)}
                className="mt-4"
                {...materialProps}
              >
                Browse Menu
              </Button>
            </motion.div>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="mt-8"
            >
              <Card className="bg-blue-50 border border-blue-100" {...materialProps}>
                <CardBody {...materialProps}>
                  <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" color="blue-gray" {...materialProps}>
                      Order Summary
                    </Typography>
                    <Typography variant="h4" color="blue-gray" className="font-bold" {...materialProps}>
                      ₹{total}
                    </Typography>
                  </div>
                  <Button
                    color="blue"
                    size="lg"
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    {...materialProps}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
