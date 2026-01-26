import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  X,
  Plus,
  Save,
  Image as ImageIcon,
  DollarSign,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../lib/api";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ================= IMAGES ================= */
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  /* ================= FORM DATA ================= */
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    collection: "",
    price: "",
    comparePrice: "",
    active: true,
  });

  /* ================= SIZES (NUMBER) ================= */
  const [sizes, setSizes] = useState([{ size: "", stock: 0 }]);

  /* ================= HANDLERS ================= */

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------- Cover Image ---------- */
  const handleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  /* ---------- Gallery Images ---------- */
  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      setGalleryImages((prev) => [...prev, file]);
      setGalleryPreviews((prev) => [
        ...prev,
        URL.createObjectURL(file),
      ]);
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- Sizes ---------- */
  const handleSizeChange = (index, field, value) => {
    const updated = [...sizes];
    updated[index][field] =
      field === "stock" || field === "size"
        ? Math.max(0, Number(value))
        : value;
    setSizes(updated);
  };

  const addSizeRow = () => {
    setSizes((prev) => [...prev, { size: "", stock: 0 }]);
  };

  const removeSizeRow = (index) => {
    if (sizes.length === 1) return;
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim())
      return toast.error("Product name is required");

    if (!formData.category.trim())
      return toast.error("Category is required");

    if (!formData.price || Number(formData.price) <= 0)
      return toast.error("Valid price is required");

    if (!coverImage)
      return toast.error("Cover image is required");

    const cleanedSizes = sizes
      .filter(
        (s) =>
          Number.isFinite(Number(s.size)) &&
          Number(s.size) > 0 &&
          Number.isFinite(Number(s.stock)) &&
          s.stock >= 0
      )
      .map((s) => ({
        size: Number(s.size),
        stock: Number(s.stock),
      }));

    if (cleanedSizes.length === 0)
      return toast.error("At least one valid size is required");

    setLoading(true);

    try {
      const data = new FormData();

      /* text fields */
      Object.entries(formData).forEach(([k, v]) =>
        data.append(k, v)
      );

      data.append("sizes", JSON.stringify(cleanedSizes));

      /* images */
      data.append("coverImage", coverImage);

      galleryImages.forEach((file) =>
        data.append("galleryImages", file)
      );

      await api.post("/api/products", data);

      toast.success("Product created successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            to="/products"
            className="mr-4 p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Details */}
          <div className="bg-white p-6 rounded-xl border space-y-4">
            <input
              name="name"
              placeholder="Product Name *"
              className="w-full p-2 border rounded-lg"
              value={formData.name}
              onChange={handleInputChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              rows={4}
              className="w-full p-2 border rounded-lg"
              value={formData.description}
              onChange={handleInputChange}
            />

            <textarea
              name="shortDescription"
              placeholder="Short Description"
              rows={2}
              className="w-full p-2 border rounded-lg"
              value={formData.shortDescription}
              onChange={handleInputChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="category"
                placeholder="Category *"
                className="p-2 border rounded-lg"
                value={formData.category}
                onChange={handleInputChange}
              />
              <input
                name="collection"
                placeholder="Collection"
                className="p-2 border rounded-lg"
                value={formData.collection}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Pricing & Sizes */}
          <div className="bg-white p-6 rounded-xl border space-y-4">
            <h2 className="text-lg font-semibold">Pricing & Inventory</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="price"
                type="number"
                placeholder="Price *"
                className="p-2 border rounded-lg"
                value={formData.price}
                onChange={handleInputChange}
              />
              <input
                name="comparePrice"
                type="number"
                placeholder="Compare Price"
                className="p-2 border rounded-lg"
                value={formData.comparePrice}
                onChange={handleInputChange}
              />
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Size (Number) & Stock
              </label>

              {sizes.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Size (e.g. 38, 40)"
                    className="flex-1 p-2 border rounded-lg"
                    value={s.size}
                    onChange={(e) =>
                      handleSizeChange(i, "size", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    min="0"
                    placeholder="Stock"
                    className="w-28 p-2 border rounded-lg"
                    value={s.stock}
                    onChange={(e) =>
                      handleSizeChange(i, "stock", e.target.value)
                    }
                  />

                  {sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeRow(i)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addSizeRow}
                className="flex items-center text-blue-600 text-sm hover:underline"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add another size
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT – IMAGES */}
        <div className="bg-white p-6 rounded-xl border space-y-4">
          <h2 className="font-semibold">Cover Image *</h2>

          {coverPreview ? (
            <img
              src={coverPreview}
              alt="Cover"
              className="aspect-square object-cover rounded-lg border"
            />
          ) : (
            <label className="aspect-square border-dashed border rounded-lg flex items-center justify-center cursor-pointer">
              <ImageIcon className="text-gray-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverSelect}
              />
            </label>
          )}

          <h2 className="font-semibold mt-4">Gallery Images</h2>

          <div className="grid grid-cols-2 gap-2">
            {galleryPreviews.map((url, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt=""
                  className="aspect-square object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeGalleryImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <label className="aspect-square border-dashed border rounded-lg flex items-center justify-center cursor-pointer">
              <ImageIcon className="text-gray-400" />
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleGallerySelect}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
