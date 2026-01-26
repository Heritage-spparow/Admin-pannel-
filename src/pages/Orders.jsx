import React, { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";

/* ----------------------------------
   Status Badge
----------------------------------- */
const StatusBadge = ({ status }) => {
  const map = {
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
};

export default function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [statusFilter, setStatusFilter] = useState("all");

  const limit = 20;

  /* ----------------------------------
     FETCH ORDERS (ADMIN)
  ----------------------------------- */
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
      };

      const { data } = await api.get("/orders", { params });

      setOrders(data.orders || []);
      setTotal(data.pagination.total || 0);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  /* ----------------------------------
     UPDATE ORDER STATUS
  ----------------------------------- */
  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  /* ----------------------------------
     CANCEL ORDER (ADMIN)
  ----------------------------------- */
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err) {
      toast.error("Cancel failed");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Orders</h1>

        <select
          className="border px-3 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Order
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Customer
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                Total
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">
                Payment
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                {/* Order ID */}
                <td className="px-4 py-3 font-medium text-gray-900">
                  #{order.orderNumber || order._id.slice(-8)}
                </td>

                {/* Customer */}
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {order.user?.email || "Guest"}
                  </div>
                </td>

                {/* Total */}
                <td className="px-4 py-3 text-right font-semibold">
                  ₹{order.totalPrice}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
              ${
                order.status === "confirmed"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "shipped"
                  ? "bg-purple-100 text-purple-700"
                  : order.status === "delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
                  >
                    {order.status}
                  </span>
                </td>

                {/* Payment */}
                <td className="px-4 py-3 text-center">
                  {order.isPaid ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      ● Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                      ● Unpaid
                    </span>
                  )}
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {/* View */}
                    <button
                      onClick={() =>
                        navigate(`/orders/details?id=${order._id}`)
                      }
                      className="p-2 rounded-lg border hover:bg-gray-100"
                      title="View order"
                    >
                      👁️
                    </button>

                    {/* Ship */}
                    {order.status === "confirmed" && (
                      <button
                        onClick={() => updateStatus(order._id, "shipped")}
                        className="p-2 rounded-lg border hover:bg-purple-50"
                        title="Mark shipped"
                      >
                        🚚
                      </button>
                    )}

                    {/* Deliver */}
                    {order.status === "shipped" && (
                      <button
                        onClick={() => updateStatus(order._id, "delivered")}
                        className="p-2 rounded-lg border hover:bg-green-50"
                        title="Mark delivered"
                      >
                        ✅
                      </button>
                    )}

                    {/* Cancel */}
                    {order.status !== "cancelled" &&
                      order.status !== "delivered" && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="p-2 rounded-lg border hover:bg-red-50 text-red-600"
                          title="Cancel order"
                        >
                          ✖
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end space-x-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
