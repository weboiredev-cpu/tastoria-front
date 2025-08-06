"use client";

import { Navbar, Footer } from "@/components";
import {
  Typography,
  Button,
  IconButton,
  Card,
  CardBody,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiPhone } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import toast from 'react-hot-toast';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  img: string;
  description: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const total = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setCartTotal(total);
  }, [cart]);

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    if (!session) {
      toast.error('Please sign in to continue');
      return;
    }
    setShowPhoneDialog(true);
  };

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!number) {
      return "Phone number is required";
    }
    if (!phoneRegex.test(number)) {
      return "Please enter a valid 10-digit Indian phone number";
    }
    return "";
  };

  const handlePhoneSubmit = () => {
    const error = validatePhoneNumber(phoneNumber);
    if (error) {
      setPhoneError(error);
      return;
    }

    // Save phone number with order details
    localStorage.setItem('userPhone', phoneNumber);
    setShowPhoneDialog(false);
    router.push('/order-confirmation');
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-32">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/menu-page">
            <Button
              variant="text"
              className="flex items-center gap-2"
              color="blue-gray"
            >
              <FiArrowLeft className="h-4 w-4" /> Back to Menu
            </Button>
          </Link>
          <Typography variant="h2" color="blue-gray">
            Your Cart
          </Typography>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <Typography variant="h4" color="blue-gray" className="mb-4">
              Your cart is empty
            </Typography>
            <Link href="/menu-page">
              <Button color="blue" size="lg">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.map((item, index) => (
                <Card key={index} className="mb-4 overflow-hidden">
                  <CardBody className="flex gap-4">
                    <div className="w-24 h-24 relative rounded-xl overflow-hidden">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <Typography variant="h6" color="blue-gray">
                            {item.name}
                          </Typography>
                          <Typography variant="small" color="gray" className="font-normal">
                            {item.description}
                          </Typography>
                        </div>
                        <Typography variant="h6" color="blue-gray">
                          ₹{item.price}
                        </Typography>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <FiMinus className="h-4 w-4" />
                          </IconButton>
                          <Typography className="w-12 text-center">
                            {item.quantity}
                          </Typography>
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <FiPlus className="h-4 w-4" />
                          </IconButton>
                        </div>
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => removeItem(index)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardBody>
                  <Typography variant="h5" color="blue-gray" className="mb-4">
                    Order Summary
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Typography color="gray">Subtotal</Typography>
                      <Typography color="blue-gray">₹{cartTotal}</Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography color="gray">Delivery Fee</Typography>
                      <Typography color="blue-gray">₹0</Typography>
                    </div>
                    <div className="border-t border-blue-gray-50 my-4"></div>
                    <div className="flex justify-between">
                      <Typography variant="h6">Total</Typography>
                      <Typography variant="h6" color="blue">₹{cartTotal}</Typography>
                    </div>
                  </div>
                  <Button
                    color="blue"
                    size="lg"
                    fullWidth
                    className="mt-6"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Phone Number Dialog */}
      <Dialog open={showPhoneDialog} handler={() => setShowPhoneDialog(false)}>
        <DialogHeader>Enter Your Phone Number</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <Typography color="gray" className="text-sm">
              Please enter your phone number for order confirmation
            </Typography>
            <div className="relative">
              <Input
                type="tel"
                label="Phone Number"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setPhoneError("");
                }}
                error={!!phoneError}
                icon={<FiPhone />}
              />
              {phoneError && (
                <Typography color="red" className="text-xs mt-1">
                  {phoneError}
                </Typography>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowPhoneDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button color="blue" onClick={handlePhoneSubmit}>
            Confirm Order
          </Button>
        </DialogFooter>
      </Dialog>

      
    </>
  );
} 