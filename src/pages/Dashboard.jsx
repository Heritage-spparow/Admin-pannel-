import React, { useEffect, useState, useRef } from "react";
import {
  ShoppingCart,
  Package,
  AlertTriangle,
  Eye,
  IndianRupee,
  Bell,
} from "lucide-react";
import api, { adminAPI } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ======================
   STAT CARD
====================== */
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
      <p className="text-sm text-gray-500 mt-2">{title}</p>
    </div>
  );
};

/* ======================
   RECENT ORDER ROW
====================== */
const RecentOrderRow = ({ order, onView }) => (
  <tr
    className="hover:bg-gray-50 cursor-pointer"
    onClick={() => onView(order._id)}
  >
    <td className="px-6 py-4 font-medium text-gray-900">
      #{order.orderNumber || order._id.slice(-6)}
    </td>
    <td className="px-6 py-4 text-gray-600">
      {order.user?.email || "Customer"}
    </td>
    <td className="px-6 py-4 font-medium">
      ₹{order.totalPrice.toLocaleString()}
    </td>
    <td className="px-6 py-4">
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium
          ${
            order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "shipped"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
      >
        {order.status}
      </span>
    </td>
    <td className="px-6 py-4 text-gray-500">
      {new Date(order.createdAt).toLocaleDateString()}
    </td>
    <td className="px-6 py-4 text-right">
      <Eye className="w-4 h-4 text-blue-600" />
    </td>
  </tr>
);

/* ======================
   DASHBOARD
====================== */
export default function Dashboard() {
  const navigate = useNavigate();

  // Dashboard data
  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Refs (IMPORTANT: prevents re-render loops)
  const lastCheckedRef = useRef(new Date().toISOString());
  const pollingTimeoutRef = useRef(null);
  const pollingDelayRef = useRef(20000); // start 20s
  const audioRef = useRef(null);

  /* ======================
     INIT SOUND
  ====================== */
  useEffect(() => {
    audioRef.current = new Audio("/sounds/order.mp3");
  }, []);

  /* ======================
     FETCH DASHBOARD DATA
  ====================== */
  useEffect(() => {
    async function fetchData() {
      try {
        const [overviewRes, chartRes, ordersRes] = await Promise.all([
          api.get("/admin/overview"),
          api.get("/admin/reports/sales", { params: { period } }),
          api.get("/orders", { params: { limit: 8 } }),
        ]);

        setOverview(overviewRes.data);
        setChartData(chartRes.data.data || []);
        setRecentOrders(ordersRes.data.orders || []);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [period]);

  /* ======================
     🔔 POLL NEW ORDERS
  ====================== */
  useEffect(() => {
    let stopped = false;

    const poll = async () => {
      if (stopped) return;

      try {
        const { data } = await adminAPI.getNewOrders(lastCheckedRef.current);

        if (data?.count > 0) {
          // 🔊 play sound
          audioRef.current?.play().catch(() => {});

          setNotifications((prev) => [...data.orders, ...prev].slice(0, 10));
          setUnreadCount((prev) => prev + data.count);

          data.orders.forEach((order) => {
            toast.success(`🛒 New Order #${order.orderNumber}`, {
              onClick: () => navigate(`/orders/details?id=${order._id}`),
            });
          });

          lastCheckedRef.current = data.now;
        }

        pollingDelayRef.current = 20000; // reset delay
      } catch (err) {
        if (err.response?.status === 429) {
          // ⏳ exponential backoff
          pollingDelayRef.current = Math.min(
            pollingDelayRef.current * 2,
            120000
          );
          console.warn("Rate limited — slowing polling");
        }
      } finally {
        pollingTimeoutRef.current = setTimeout(poll, pollingDelayRef.current);
      }
    };

    poll();

    return () => {
      stopped = true;
      clearTimeout(pollingTimeoutRef.current);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  const sales = overview?.sales?.month || {};
  const ordersOverview = overview?.ordersOverview || {};

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Store performance overview</p>
        </div>

        {/* 🔔 Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications((p) => !p);
              setUnreadCount(0);
            }}
            className="relative p-2 rounded-lg hover:bg-gray-100"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-lg z-50">
              <div className="px-4 py-3 border-b font-semibold">
                Notifications
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((order) => (
                    <div
                      key={order._id}
                      onClick={() =>
                        navigate(`/orders/details?id=${order._id}`)
                      }
                      className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b"
                    >
                      <p className="font-medium">
                        New Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{order.totalPrice} •{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Revenue"
          value={`₹${sales.revenue?.toLocaleString() || 0}`}
          icon={IndianRupee}
          color="green"
        />
        <StatCard
          title="Monthly Orders"
          value={sales.orders || 0}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Active Products"
          value={overview?.activeProducts || 0}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Low Stock"
          value={overview?.lowStockCount || 0}
          icon={AlertTriangle}
          color="orange"
        />
      </div>

      {/* CHART + STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SALES CHART */}
        <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm">
          <div className="p-5 border-b flex justify-between">
            <h3 className="font-semibold text-gray-900">Sales Overview</h3>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last year</option>
            </select>
          </div>

          <div className="p-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ORDER STATUS */}
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="p-5 border-b">
            <h3 className="font-semibold text-gray-900">Order Status</h3>
          </div>

          <div className="p-5 space-y-3">
            {["confirmed", "shipped", "delivered"].map((status) => (
              <div key={status} className="flex justify-between text-sm">
                <span className="capitalize text-gray-600">{status}</span>
                <span className="font-medium">
                  {ordersOverview[status] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs uppercase">View</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <RecentOrderRow
                    key={order._id}
                    order={order}
                    onView={(id) => navigate(`/orders/details?id=${id}`)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
