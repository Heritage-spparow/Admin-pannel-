import React, { useState } from 'react';
import {
  Search as SearchIcon,
  Filter,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Calendar,
  MapPin,
  Tag,
  DollarSign
} from 'lucide-react';

const SearchResult = ({ type, data, onSelect }) => {
  const getIcon = () => {
    switch (type) {
      case 'product':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'order':
        return <ShoppingCart className="w-5 h-5 text-green-500" />;
      case 'customer':
        return <Users className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'product':
        return `${data.category} • Stock: ${data.stock} • ₹${data.price}`;
      case 'order':
        return `${data.status} • ₹${data.total} • ${data.date}`;
      case 'customer':
        return `${data.email} • ${data.orders} orders • ₹${data.totalSpent}`;
      default:
        return data.description;
    }
  };

  return (
    <div 
      onClick={() => onSelect(type, data)}
      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {data.name || data.title}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {getDescription()}
        </p>
      </div>
      <div className="flex-shrink-0 ml-3">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          type === 'product' ? 'bg-blue-100 text-blue-800' :
          type === 'order' ? 'bg-green-100 text-green-800' :
          type === 'customer' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {type}
        </span>
      </div>
    </div>
  );
};

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock search results for demonstration
  const mockResults = [
    {
      type: 'product',
      data: {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        category: 'Electronics',
        stock: 45,
        price: 2999
      }
    },
    {
      type: 'product',
      data: {
        id: '2',
        name: 'Cotton T-Shirt',
        category: 'Clothing',
        stock: 120,
        price: 599
      }
    },
    {
      type: 'order',
      data: {
        id: 'ORD001',
        name: 'Order #ORD001',
        status: 'Delivered',
        total: 3599,
        date: '2024-01-15'
      }
    },
    {
      type: 'customer',
      data: {
        id: 'CUST001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        orders: 12,
        totalSpent: 25490
      }
    }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredResults = mockResults.filter(result => {
        if (searchType !== 'all' && result.type !== searchType) return false;
        
        const searchData = result.data;
        const searchString = `${searchData.name} ${searchData.category || ''} ${searchData.email || ''}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
      });
      
      setResults(filteredResults);
      setLoading(false);
    }, 500);
  };

  const handleResultSelect = (type, data) => {
    // Handle navigation to the selected item
    console.log('Selected:', type, data);
    switch (type) {
      case 'product':
        window.location.href = `/products/details?id=${data.id}`;
        break;
      case 'order':
        window.location.href = `/orders/details?id=${data.id}`;
        break;
      case 'customer':
        window.location.href = `/customers?id=${data.id}`;
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600 mt-1">
          Search across products, orders, customers, and more
        </p>
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          {/* Search Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All', icon: FileText },
                { value: 'product', label: 'Products', icon: Package },
                { value: 'order', label: 'Orders', icon: ShoppingCart },
                { value: 'customer', label: 'Customers', icon: Users },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSearchType(value)}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    searchType === value
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SearchIcon className="w-4 h-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results ({results.length})
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {results.map((result, index) => (
              <SearchResult
                key={`${result.type}-${result.data.id}-${index}`}
                type={result.type}
                data={result.data}
                onSelect={handleResultSelect}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchTerm && !loading && results.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        </div>
      )}

      {/* Quick Filters */}
      {!searchTerm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Products</h3>
                <p className="text-sm text-gray-500">Search all products</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Orders</h3>
                <p className="text-sm text-gray-500">Find specific orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Customers</h3>
                <p className="text-sm text-gray-500">Look up customers</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Reports</h3>
                <p className="text-sm text-gray-500">Find reports & analytics</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}