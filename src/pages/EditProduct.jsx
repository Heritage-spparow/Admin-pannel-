import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  X,
  Plus,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../lib/api";
import { cloudinaryOptimize } from "../utils/cloudinary";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ================= IMAGES ================= */
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

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

  /* ================= SIZES ================= */
  const [sizes, setSizes] = useState([{ size: "", stock: 0 }]);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await api.get(`/products-enhanced/${id}`);
        const p = data.product;

        setFormData({
          name: p.name || "",
          description: p.description || "",
          shortDescription: p.shortDescription || "",
          category: p.category || "",
          collection: p.collection || "",
          price: p.price || "",
          comparePrice: p.comparePrice || "",
          active: p.active ?? true,
        });

        setSizes(p.sizes?.length ? p.sizes : [{ size: "", stock: 0 }]);
        setCoverPreview(p.coverImage?.url || null);
        setExistingImages(p.galleryImages || []);
      } catch {
        toast.error("Failed to load product");
        navigate("/products");
      }
    }

    fetchProduct();
  }, [id, navigate]);

  /* ================= HANDLERS ================= */

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ---------- Cover Image ---------- */
  const handleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
    setRemoveCover(false);
  };

  const clearCoverImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
    setRemoveCover(true);
  };

  /* ---------- Gallery Images ---------- */
  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      setGalleryImages((p) => [...p, file]);
      setGalleryPreviews((p) => [...p, URL.createObjectURL(file)]);
    });
  };

  const removeNewGalleryImage = (index) => {
    setGalleryImages((p) => p.filter((_, i) => i !== index));
    setGalleryPreviews((p) => p.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((p) => p.filter((_, i) => i !== index));
  };

  /* ---------- Sizes ---------- */
  const handleSizeChange = (i, field, value) => {
    const updated = [...sizes];
    updated[i][field] = Math.max(0, Number(value));
    setSizes(updated);
  };

  const addSizeRow = () =>
    setSizes((p) => [...p, { size: "", stock: 0 }]);

  const removeSizeRow = (i) =>
    sizes.length > 1 &&
    setSizes((p) => p.filter((_, idx) => idx !== i));

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!formData.name.trim())
      return toast.error("Product name is required");

    if (!formData.category.trim())
      return toast.error("Category is required");

    if (!formData.price || Number(formData.price) <= 0)
      return toast.error("Valid price required");

    const cleanedSizes = sizes.filter(
      (s) => Number(s.size) > 0 && s.stock >= 0
    );

    if (!cleanedSizes.length)
      return toast.error("At least one valid size required");

    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([k, v]) =>
        data.append(k, v)
      );

      data.append("sizes", JSON.stringify(cleanedSizes));
      data.append("existingImages", JSON.stringify(existingImages));

      if (removeCover) {
        data.append("removeCover", "true");
      }

      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      galleryImages.forEach((file) =>
        data.append("galleryImages", file)
      );

      await api.put(`/products-enhanced/${id}`, data);

      toast.success("Product updated successfully");
      navigate("/products");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Update failed"
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
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Edit Product</h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Update Product"}
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
            <h2 className="text-lg font-semibold">
              Pricing & Inventory
            </h2>

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
                Size & Stock
              </label>

              {sizes.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Size"
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
                className="flex items-center text-blue-600 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add another size
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT – IMAGES */}
        <div className="bg-white p-6 rounded-xl border space-y-4">
          <h2 className="font-semibold">Cover Image</h2>

          {coverPreview ? (
            <div className="relative">
              <img
                src={cloudinaryOptimize(
                     coverPreview,
                      "card"
                    )}
                alt="Cover"
                className="aspect-square object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={clearCoverImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
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
            {existingImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                   src={cloudinaryOptimize(
                      img?.url,
                      "card"
                    )}
                  alt=""
                  className="aspect-square object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeExistingImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {galleryPreviews.map((url, i) => (
              <div key={i} className="relative">
                <img
                   src={cloudinaryOptimize(
                      url,
                      "card"
                    )}
                  alt=""
                  className="aspect-square object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeNewGalleryImage(i)}
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
