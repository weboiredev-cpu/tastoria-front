"use client";

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
} from "@material-tailwind/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiPhone, FiShoppingBag } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from "next-auth/react";
import { motion } from 'framer-motion';

const VALID_TABLES = Array.from({ length: 30 }, (_, i) => String(i + 1));

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
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);

  useEffect(() => {
    if (!VALID_TABLES.includes(tableId)) {
      toast.error('Invalid table number');
      router.push('/');
      return;
    }
    const initialCart = cartStorage.load(tableId);
    setCart(initialCart);
    calculateTotal(initialCart);
    if (session?.user && !session.user.phone) {
      setShowPhoneDialog(true);
    }
  }, [tableId, router, session]);

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
    if (!session?.user?.phone || !/^\d{10}$/.test(session.user.phone)) {
      toast.error("Please enter a valid 10-digit phone number before placing the order");
      setShowPhoneDialog(true);
      return;
    }
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsLoading(true);
    const order = {
      tableId,
      customerName: session?.user?.name || "Guest",
      phoneNumber: session?.user?.phone,
      userEmail: session?.user?.email || "",
      items: cart,
      total,
      orderTime: new Date().toISOString(),
      source: "website"
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/orders/place`, {
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
          <div className="flex items-center justify-between mb-8 mt-14">
            <Button
              color="blue-gray"
              variant="text"
              className="flex items-center gap-2"
              onClick={() => router.push(`/table/${tableId}`)}
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              <FiArrowLeft className="h-4 w-4" />
              <span>Back to Menu</span>
            </Button>
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{tableId}</span>
              </div>
              <Typography
                variant="h4"
                color="blue-gray"
                className="font-bold"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
              >
                Table {tableId}
              </Typography>
              {session?.user?.name && (
                <Typography
                  variant="small"
                  color="gray"
                  className="italic"
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                >
                  {session.user.name}
                </Typography>
              )}
            </div>
          </div>

          {/* Cart Items */}
          {cart.length > 0 ? (
            <Card
              className="overflow-hidden shadow-lg"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              <CardBody
                className="p-0"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
              >
                <div className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="font-medium"
                          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                        >
                          {item.name}
                        </Typography>
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            Qty: {item.quantity}
                          </span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                            ₹{item.price}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="font-bold"
                          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                        >
                          ₹{item.price * item.quantity}
                        </Typography>
                        <div className="flex items-center gap-2">
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                          >
                            <FiMinus className="h-4 w-4" />
                          </IconButton>
                          <Typography
                            variant="h6"
                            className="w-8 text-center"
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            variant="text"
                            color="blue-gray"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                          >
                            <FiPlus className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            variant="text"
                            color="red"
                            size="sm"
                            onClick={() => removeItem(index)}
                            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
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
              <Typography
                variant="h5"
                color="blue-gray"
                className="mb-2"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
              >
                Your cart is empty
              </Typography>
              <Typography
                color="gray"
                className="mb-6"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
              >
                Add some delicious items from the menu
              </Typography>
              <Button
                color="blue"
                onClick={() => router.push(`/table/${tableId}`)}
                className="mt-4"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
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
              <Card
                className="bg-blue-50 border border-blue-100"
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
              >
                <CardBody
                  placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                    >
                      Order Summary
                    </Typography>
                    <Typography
                      variant="h4"
                      color="blue-gray"
                      className="font-bold"
                      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
                    >
                      ₹{total}
                    </Typography>
                  </div>
                  <Button
                    color="blue"
                    size="lg"
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
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
          <Dialog
            open={showPhoneDialog}
            handler={() => setShowPhoneDialog(false)}
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
          >
            <DialogHeader
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              <FiPhone className="mr-2" /> Enter Your Phone Number
            </DialogHeader>
            <DialogBody
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              <Input
                label="Phone Number"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                error={!!phoneError}
                crossOrigin={undefined}
                onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </DialogBody>
            <DialogFooter
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              <Button
                color="blue"
                onClick={async () => {
                  if (!/^\d{10}$/.test(phoneInput)) {
                    setPhoneError("Enter a valid 10-digit number");
                    return;
                  }
                  setSavingPhone(true);
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}api/users/phone`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: session?.user?.email, phone: phoneInput }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      toast.success("Phone number saved!");
                      setShowPhoneDialog(false);
                      setPhoneError("");
                      await update({ phone: phoneInput });
                    } else {
                      toast.error(data.message || "Failed to save number");
                    }
                  } catch (err) {
                    toast.error("Server error, try again later");
                  } finally {
                    setSavingPhone(false);
                  }
                }}
                disabled={savingPhone}
                placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
              >
                {savingPhone ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
}
