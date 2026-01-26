import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  Mail,
} from "lucide-react";
import api from "../api/api";
import { toast } from "react-toastify";
import { cloudinaryOptimize } from "../utils/cloudinary";

/* -----------------------------
   Status Badge
------------------------------ */
const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

/* -----------------------------
   Order Item
------------------------------ */
const OrderItem = ({ item }) => {
  const imageUrl = cloudinaryOptimize(item.image, "detail");

  return (
    <div className="flex items-center gap-4 py-3 border-b last:border-none">
      <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <Package className="w-5 h-5 text-gray-400" />
        )}
      </div>

      <div className="flex-1">
        <p className="font-medium text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500">
          Qty {item.quantity} × ₹{item.price}
        </p>
      </div>

      <p className="font-medium">
        ₹{(item.quantity * item.price).toLocaleString()}
      </p>
    </div>
  );
};

export default function OrderDetails() {
  const [params] = useSearchParams();
  const orderId = params.get("id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -----------------------------
     Fetch order
  ------------------------------ */
  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data.order);
    } catch {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  /* -----------------------------
     Invoice actions
  ------------------------------ */
  const handleInvoice = async (print = false) => {
    try {
      const { data } = await api.get(`/orders/${order._id}/invoice`, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(new Blob([data]));
      if (print) {
        window.open(url);
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${order.orderNumber}.pdf`;
        a.click();
      }
    } catch {
      toast.error("Invoice not available");
    }
  };

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Loading order…
      </div>
    );

  if (!order)
    return (
      <div className="text-center py-12 text-gray-500">
        Order not found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="border-b pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Order #{order.orderNumber || order._id.slice(-8)}
            </h1>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleInvoice(true)}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            <Printer className="inline w-4 h-4 mr-1" />
            Print
          </button>
          <button
            onClick={() => handleInvoice(false)}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
          >
            <Download className="inline w-4 h-4 mr-1" />
            Invoice
          </button>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Order Summary</h2>
              <StatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-gray-500">Payment</p>
                <p className="mt-1 font-medium flex items-center gap-1">
                  {order.isPaid ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Paid
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      Unpaid
                    </>
                  )}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Method</p>
                <p className="mt-1 font-medium capitalize">
                  {order.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Items</p>
                <p className="mt-1 font-medium">
                  {order.orderItems.length}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Total</p>
                <p className="mt-1 font-semibold text-base">
                  ₹{order.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h2 className="font-semibold mb-3">Items</h2>
            {order.orderItems.map((item, i) => (
              <OrderItem key={i} item={item} />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h2 className="font-semibold mb-3">Customer</h2>
            <p className="font-medium">{order.user?.email}</p>
            <button className="mt-2 text-sm text-blue-600 flex items-center gap-1 hover:underline">
              <Mail className="w-4 h-4" />
              Email customer
            </button>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h2 className="font-semibold mb-3">Shipping</h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
            <h2 className="font-semibold mb-3">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Order placed
              </div>
              {order.isPaid && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Payment received
                </div>
              )}
              {order.status === "shipped" && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  Shipped
                </div>
              )}
              {order.status === "delivered" && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full" />
                  Delivered
                </div>
              )}
              {order.status === "cancelled" && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  Cancelled
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
