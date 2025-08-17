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
            {/* ✅ Added props to fix build error */}
            <Button
              variant="text"
              className="flex items-center gap-2"
              color="blue-gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              <FiArrowLeft className="h-4 w-4" /> Back to Menu
            </Button>
          </Link>
          {/* ✅ Added props to fix build error */}
          <Typography
            variant="h2"
            color="blue-gray"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            Your Cart
          </Typography>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <Typography
              variant="h4"
              color="blue-gray"
              className="mb-4"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              Your cart is empty
            </Typography>
            <Link href="/menu-page">
              <Button
                color="blue"
                size="lg"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.map((item, index) => (
                <Card
                  key={index}
                  className="mb-4 overflow-hidden"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                >
                  <CardBody
                    className="flex gap-4"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    onResize={undefined}
                    onResizeCapture={undefined}
                  >
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
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            {item.description}
                          </Typography>
                        </div>
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                          onResize={undefined}
                          onResizeCapture={undefined}
                        >
                          ₹{item.price}
                        </Typography>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            <FiMinus className="h-4 w-4" />
                          </IconButton>
                          <Typography
                            className="w-12 text-center"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            variant="text"
                            size="sm"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                            onResize={undefined}
                            onResizeCapture={undefined}
                          >
                            <FiPlus className="h-4 w-4" />
                          </IconButton>
                        </div>
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => removeItem(index)}
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                          onResize={undefined}
                          onResizeCapture={undefined}
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
              <Card
                className="sticky top-24"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                <CardBody
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                >
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-4"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    onResize={undefined}
                    onResizeCapture={undefined}
                  >
                    Order Summary
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Typography
                        color="gray"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                      >
                        Subtotal
                      </Typography>
                      <Typography
                        color="blue-gray"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                      >
                        ₹{cartTotal}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography
                        color="gray"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                      >
                        Delivery Fee
                      </Typography>
                      <Typography
                        color="blue-gray"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                      >
                        ₹0
                      </Typography>
                    </div>
                    <div className="border-t border-blue-gray-50 my-4"></div>
                    <div className="flex justify-between">
                      <Typography
                        variant="h6"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                      >
                        Total
                      </Typography>
                      <Typography
                        variant="h6"
                        color="blue"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                      >
                        ₹{cartTotal}
                      </Typography>
                    </div>
                  </div>
                  <Button
                    color="blue"
                    size="lg"
                    fullWidth
                    className="mt-6"
                    onClick={handleCheckout}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    onResize={undefined}
                    onResizeCapture={undefined}
                  >
                    Proceed to Checkout
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={showPhoneDialog}
        handler={() => setShowPhoneDialog(false)}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        <DialogHeader
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          Enter Your Phone Number
        </DialogHeader>
        <DialogBody
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          <div className="space-y-4">
            <Typography
              color="gray"
              className="text-sm"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onResize={undefined}
              onResizeCapture={undefined}
            >
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
                crossOrigin={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                onResize={undefined}
                onResizeCapture={undefined}
              />
              {phoneError && (
                <Typography
                  color="red"
                  className="text-xs mt-1"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onResize={undefined}
                  onResizeCapture={undefined}
                >
                  {phoneError}
                </Typography>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          <Button
            variant="text"
            color="red"
            onClick={() => setShowPhoneDialog(false)}
            className="mr-1"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={handlePhoneSubmit}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            Confirm Order
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}