"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
  Input,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { FiEdit2, FiTrash2, FiPlus, FiUpload } from "react-icons/fi";
import Image from "next/image";
import toast from "react-hot-toast";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  img: string;
  paused: boolean;
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    img: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const categories = [
    "starters",
    "main_course",
    "desserts",
    "beverages",
    "snacks",
    "others",
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/menu/all");
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.items);
      } else {
        toast.error("Failed to fetch menu items");
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      toast.error("Error loading menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (
    file: File,
    name: string,
    description: string,
    price: number,
    category: string
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/api/menu/add", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item added successfully");
        setShowAddDialog(false);
        fetchMenuItems();
        setFormData({ name: "", description: "", price: "", category: "", img: "" });
        setSelectedImage(null);
        setImagePreview("");
      } else {
        toast.error(data.message || "Failed to add menu item");
      }
    } catch (err) {
      console.error("Error adding menu item:", err);
      toast.error("Error adding menu item");
    }
  };

  const handleAddItem = async () => {
    try {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        toast.error("Please enter a valid price");
        return;
      }

      if (!selectedImage) {
        toast.error("Please select an image");
        return;
      }

      // Upload image first
      const uploadResponse = await uploadImage(
        selectedImage,
        formData.name,
        formData.description,
        price,
        formData.category
      );

      const response = await fetch("http://localhost:5000/api/menu/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price,
          img: imageUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item added successfully");
        setShowAddDialog(false);
        fetchMenuItems();
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          img: "",
        });
        setSelectedImage(null);
        setImagePreview("");
      } else {
        toast.error(data.message || "Failed to add menu item");
      }
    } catch (err) {
      console.error("Error adding menu item:", err);
      toast.error("Error adding menu item");
    }
  };

  const handleEditItem = async () => {
    if (!selectedItem) return;

    try {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        toast.error("Please enter a valid price");
        return;
      }

      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("description", formData.description);
      updateData.append("price", price.toString());
      updateData.append("category", formData.category);
      if (selectedImage) {
        updateData.append("image", selectedImage);
      }

      const response = await fetch(`http://localhost:5000/api/menu/update/${selectedItem._id}`, {
        method: "PUT",
        body: updateData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item updated successfully");
        setShowEditDialog(false);
        fetchMenuItems();
        setSelectedImage(null);
        setImagePreview("");
      } else {
        toast.error(data.message || "Failed to update menu item");
      }
    } catch (err) {
      console.error("Error updating menu item:", err);
      toast.error("Error updating menu item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/menu/delete/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item deleted successfully");
        fetchMenuItems();
      } else {
        toast.error(data.message || "Failed to delete menu item");
      }
    } catch (err) {
      console.error("Error deleting menu item:", err);
      toast.error("Error deleting menu item");
    }
  };
  const handleTogglePause = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/menu/toggle/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paused: !currentStatus }),
      });
  
      const data = await response.json();
      if (data.success) {
        toast.success(`Item ${!currentStatus ? "paused" : "resumed"} successfully`);
        fetchMenuItems();
      } else {
        toast.error("Failed to toggle status");
      }
    } catch (err) {
      console.error("Error toggling item status:", err);
      toast.error("Something went wrong");
    }
  };
  

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      img: item.img,
    });
    setShowEditDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredItems = menuItems.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = filterCategory === "" || item.category === filterCategory;
    return nameMatch && categoryMatch;
  });

  // Material Tailwind component props for required event handlers
  const materialProps = {
    placeholder: "",
    onResize: () => { },
    onResizeCapture: () => { },
    onPointerEnterCapture: () => { },
    onPointerLeaveCapture: () => { },
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
        <Typography variant="h3" color="blue-gray" className="font-bold tracking-tight drop-shadow-md" {...materialProps}>
          🍽️ Menu Management
        </Typography>
        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
          <div className="w-full md:w-1/2">
            <Input
              label="🔍 Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 shadow-sm rounded-lg focus:ring-2 focus:ring-blue-300"
              crossOrigin={undefined}
              {...materialProps}
            />
          </div>
          <div className="w-full md:w-1/2">
            <Select
              label="📂 Filter by category"
              value={filterCategory}
              onChange={(value) => setFilterCategory(value || "")}
              className="w-full bg-white/80 shadow-sm rounded-lg"
              {...materialProps}
            >
              <Option value="">All Categories</Option>
              {categories.map((cat) => (
                <Option key={cat} value={cat} className="capitalize">
                  {cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <Button
          className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 shadow-lg px-6 py-3 rounded-xl text-white font-semibold text-lg transition-all duration-200"
          onClick={() => setShowAddDialog(true)}
          {...materialProps}
        >
          <FiPlus className="h-5 w-5" /> Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <Card
            key={item._id}
            className="overflow-hidden rounded-2xl shadow-xl bg-white/90 hover:scale-[1.025] hover:shadow-2xl transition-all duration-200 border border-blue-100"
          >
            <div className="relative group h-52">
              <Image
                src={item.img}
                alt={item.name}
                fill
                className="object-cover group-hover:brightness-90 transition-all duration-200"
              />
              <div className="absolute top-2 left-2 bg-white/80 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm capitalize">
                {item.category.replace(/_/g, " ")}
              </div>
            </div>
            <CardBody className="p-5" {...materialProps}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Typography variant="h5" color="blue-gray" className="font-bold text-lg" {...materialProps}>
                    {item.name}
                  </Typography>
                </div>
                <Typography variant="h6" color="blue-gray" className="font-bold text-xl text-green-600" {...materialProps}>
                  ₹{item.price}
                </Typography>
              </div>
              <Typography color="gray" className="mb-4 text-sm min-h-[48px]" {...materialProps}>
                {item.description}
              </Typography>
              <Typography
                variant="small"
                color={item.paused ? "red" : "green"}
                className="mb-2 font-medium"
                {...materialProps}
              >
                Status: {item.paused ? "Paused" : "Active"}
              </Typography>

              <Button
                size="sm"
                color={item.paused ? "green" : "orange"}
                className="rounded-md mb-2"
                onClick={() => handleTogglePause(item._id, item.paused ?? false)}
                {...materialProps}
              >
                {item.paused ? "Resume" : "Pause"}
              </Button>

              <div className="flex justify-end gap-2 mt-2">
                <IconButton
                  variant="text"
                  color="blue-gray"
                  className="hover:bg-blue-50 focus:bg-blue-100 rounded-full"
                  onClick={() => openEditDialog(item)}
                  {...materialProps}
                >
                  <FiEdit2 className="h-5 w-5" />
                </IconButton>
                <IconButton
                  variant="text"
                  color="red"
                  className="hover:bg-red-50 focus:bg-red-100 rounded-full"
                  onClick={() => handleDeleteItem(item._id)}
                  {...materialProps}
                >
                  <FiTrash2 className="h-5 w-5" />
                </IconButton>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog
        open={showAddDialog || showEditDialog}
        handler={() => (showAddDialog ? setShowAddDialog(false) : setShowEditDialog(false))}
        size="md"
        className="rounded-2xl shadow-2xl bg-white/95"
        {...materialProps}
      >
        <DialogHeader className="text-2xl font-bold text-blue-700" {...materialProps}>
          {showAddDialog ? "Add New Menu Item" : "Edit Menu Item"}
        </DialogHeader>
        <DialogBody divider className="overflow-y-auto max-h-[600px] bg-gradient-to-br from-blue-50 to-white" {...materialProps}>
          <div className="space-y-5">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/80 rounded-lg"
              crossOrigin={undefined}
              {...materialProps}
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/80 rounded-lg"
              crossOrigin={undefined}
              {...materialProps}
            />
            <Input
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="bg-white/80 rounded-lg"
              crossOrigin={undefined}
              {...materialProps}
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value || "" })}
              className="bg-white/80 rounded-lg"
              {...materialProps}
            >
              {categories.map((category) => (
                <Option key={category} value={category} className="capitalize">
                  {category.replace(/_/g, " ")}
                </Option>
              ))}
            </Select>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-200 border-dashed rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-12 h-12 mb-3 text-blue-400" />
                    <p className="mb-2 text-sm text-blue-600">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-blue-400">PNG, JPG or WEBP (MAX. 5MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {imagePreview && (
                <div className="relative w-full h-48 mt-4 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-xl border border-blue-200"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md text-lg"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-4" {...materialProps}>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              if (showAddDialog) {
                setShowAddDialog(false);
              } else {
                setShowEditDialog(false);
              }
              setSelectedImage(null);
              setImagePreview("");
            }}
            className="mr-1 px-6 py-2 rounded-lg text-base hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            {...materialProps}
          >
            Cancel
          </Button>
          <Button
            color={showAddDialog ? "green" : "blue"}
            className="px-8 py-2 rounded-lg text-base font-semibold shadow-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white transition-all duration-200"
            onClick={showAddDialog ? handleAddItem : handleEditItem}
            {...materialProps}
          >
            {showAddDialog ? "Add Item" : "Update Item"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
} 