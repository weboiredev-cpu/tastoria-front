"use client";

import Image from "next/image";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { useState } from "react";
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import toast from "react-hot-toast";

interface MenuItemCardProps {
  name?: string;
  description?: string;
  price?: string;
  img?: string;
  onAddToCart: (quantity: number) => void;
}

export function MenuItemCard({ name, description, price, img, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(quantity);
    toast.success(`${quantity} × ${name} added to cart`, {
      duration: 3000,
      position: "top-center",
    });
  };

  const fallbackImage = "https://images.unsplash.com/photo-1504674900240-9c69d0c2e5b7?w=500&h=300&fit=crop&crop=center";
  const imageUrl = img && !imageError ? img : fallbackImage;

  return (
    <Card
      className="border border-blue-gray-100 shadow-lg transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
    >
      <CardHeader
        floated={false}
        shadow={false}
        className="h-56 relative overflow-hidden"
        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
      >
        <div style={{ aspectRatio: '5 / 3', width: '100%' }}>
          <Image
            src={imageUrl}
            alt={name ?? "Food item"}
            width={500}
            height={500}
            className="h-full w-full object-cover transform transition-transform duration-300 hover:scale-110"
            onError={() => setImageError(true)}
          />
        </div>
        <div className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Typography
            variant="h6"
            color="white"
            className="text-shadow"
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
          >
            Click to Order
          </Typography>
        </div>
      </CardHeader>

      <CardBody
        className="text-center p-6"
        placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
      >
        <div className="flex justify-between items-center mb-3">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-semibold"
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
          >
            {name}
          </Typography>
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-bold text-blue-600"
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
          >
            {price}
          </Typography>
        </div>
        <Typography
          className="text-gray-600 font-normal mb-4"
          placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
        >
          {description}
        </Typography>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-center gap-4 bg-gray-50 p-2 rounded-full">
            <IconButton
              variant="text"
              size="sm"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="rounded-full hover:bg-blue-gray-50"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              <FiMinus className="h-4 w-4" />
            </IconButton>
            <Typography
              className="w-16 text-center font-medium"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              {quantity}
            </Typography>
            <IconButton
              variant="text"
              size="sm"
              onClick={() => setQuantity(q => q + 1)}
              className="rounded-full hover:bg-blue-gray-50"
              placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
            >
              <FiPlus className="h-4 w-4" />
            </IconButton>
          </div>
          <Button
            color="blue"
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 rounded-full shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-1"
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}
          >
            <FiShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default MenuItemCard;