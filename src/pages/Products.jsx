import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Grid3X3,
  List,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Upload,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onEdit, onDelete }) => {
  const totalStock =
    product.sizes?.reduce((sum, s) => sum + Number(s.stock || 0), 0) || 0;

  const isLowStock = totalStock > 0 && totalStock <= 10;
  const isOutOfStock = totalStock === 0;
  const navigate = useNavigate(); 

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {product.coverImage?.url ? (
          <img
            src=""
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {isOutOfStock && (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
              <XCircle className="w-3 h-3 mr-1" />
              Out of Stock
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Low Stock
            </span>
          )}
          {!product.active && (
            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
              Inactive
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3
            className="font-semibold text-gray-900 truncate"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">Category: {product.category}</p>
          {product.sku && (
            <p className="text-xs text-gray-400">SKU: {product.sku}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-bold text-gray-900">
              ₹{product.price?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Stock: {totalStock}</p>
          </div>
          <div className="flex items-center">
            {product.active ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <button
            onClick={() => onEdit(product)}
            className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </button>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductTableRow = ({ product, onEdit, onDelete }) => {
  const totalStock =
    product.sizes?.reduce((sum, s) => sum + Number(s.stock || 0), 0) || 0;

  const isLowStock = totalStock > 0 && totalStock <= 10;
  const isOutOfStock = totalStock === 0;
  const navigate = useNavigate(); 

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            {product.coverImage?.url ? (
              <img
                src={product.coverImage.url}
                alt={product.name}
                className="w-10 h-10 object-cover rounded-lg"
              />
            ) : (
              <Package className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            {product.sku && (
              <div className="text-sm text-gray-500">{product.sku}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        ₹{product.price?.toLocaleString()}
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex items-center">
          <span
            className={`${
              isOutOfStock
                ? "text-red-600"
                : isLowStock
                ? "text-orange-600"
                : "text-gray-900"
            }`}
          >
            {totalStock}
          </span>
          {isLowStock && (
            <AlertTriangle className="w-4 h-4 text-orange-500 ml-1" />
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            product.active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {product.active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); 

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = await api.get("/products-enhanced", {
        params: {
          limit: 50,
          search: searchTerm,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
        },
      });
      setItems(data.products || []);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(
          (data.products || []).map((p) => p.category).filter(Boolean)
        ),
      ];
      setCategories(uniqueCategories);
    } catch (e) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const handleEdit = (product) => {
    navigate(`/products/edit/${product._id}`);
  };

  const handleDelete = async (product) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products-enhanced/${product._id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };
  const filteredProducts = items;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog with ease
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Link
            to="/products/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-500">Loading products...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by adding your first product.
              </p>
              <Link
                to="/products/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <ProductTableRow
                      key={product._id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
