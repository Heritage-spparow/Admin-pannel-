import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Save,
  Trash2,
  Eye,
  Edit,
  Image as ImageIcon,
  DollarSign,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../lib/api.js';

export default function ProductDetails() {
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const productId = searchParams.get('id');

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    } else {
      // Mock product data for demonstration
      setProduct({
        _id: 'demo-product',
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and long battery life.',
        shortDescription: 'Premium wireless headphones with superior sound quality',
        price: 2999,
        comparePrice: 3999,
        cost: 1500,
        sku: 'WBH-001',
        barcode: '1234567890123',
        stock: 45,
        category: 'Electronics',
        brand: 'TechAudio',
        images: [
          'https://via.placeholder.com/400x400?text=Headphones+1',
          'https://via.placeholder.com/400x400?text=Headphones+2'
        ],
        tags: ['wireless', 'bluetooth', 'noise-cancellation'],
        active: true,
        featured: false,
        weight: 0.25,
        dimensions: {
          length: 20,
          width: 15,
          height: 8
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      });
      setLoading(false);
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${productId}`);
      setProduct(data.product);
    } catch (error) {
      toast.error('Failed to fetch product details');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/products/${product._id}`, product);
      toast.success('Product updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Error updating product:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${product._id}`);
        toast.success('Product deleted successfully!');
        window.location.href = '/products';
      } catch (error) {
        toast.error('Failed to delete product');
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
        <p className="text-gray-500 mb-6">The requested product could not be found.</p>
        <Link
          to="/products"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Link
            to="/products"
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Details</h1>
            <p className="text-gray-600 mt-1">
              {editing ? 'Edit product information' : 'View and manage product details'}
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Product
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{product.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={product.shortDescription || ''}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{product.shortDescription || 'No short description'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                {editing ? (
                  <textarea
                    value={product.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{product.description || 'No description available'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                {editing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <p className="text-lg font-semibold text-gray-900">₹{product.price?.toLocaleString()}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price</label>
                {editing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={product.comparePrice || ''}
                      onChange={(e) => handleInputChange('comparePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {product.comparePrice ? `₹${product.comparePrice.toLocaleString()}` : 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                {editing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={product.cost || ''}
                      onChange={(e) => handleInputChange('cost', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {product.cost ? `₹${product.cost.toLocaleString()}` : 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Active</span>
                {editing ? (
                  <button
                    onClick={() => handleInputChange('active', !product.active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      product.active ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        product.active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.active ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Featured</span>
                {editing ? (
                  <button
                    onClick={() => handleInputChange('featured', !product.featured)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      product.featured ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        product.featured ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.featured 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.featured ? 'Featured' : 'Not Featured'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">SKU</span>
                <p className="text-sm text-gray-900">{product.sku || 'Not set'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Category</span>
                <p className="text-sm text-gray-900">{product.category || 'Uncategorized'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Brand</span>
                <p className="text-sm text-gray-900">{product.brand || 'No brand'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Stock</span>
                <p className={`text-sm font-medium ${
                  product.stock <= 10 ? 'text-red-600' : 
                  product.stock <= 50 ? 'text-orange-600' : 
                  'text-green-600'
                }`}>
                  {product.stock} units
                </p>
              </div>
              
              {product.weight && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Weight</span>
                  <p className="text-sm text-gray-900">{product.weight} kg</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Created</span>
                <p className="text-sm text-gray-900">
                  {new Date(product.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                <p className="text-sm text-gray-900">
                  {new Date(product.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}