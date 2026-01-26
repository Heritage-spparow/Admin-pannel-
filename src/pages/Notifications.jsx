import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api.js";

export default function Notifications() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH NOTIFICATIONS
  ====================== */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/notifications");
        setItems(data.notifications || []);
      } catch (err) {
        console.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ======================
     MARK AS READ (UI ONLY)
  ====================== */
  const markAsRead = async (id) => {
    setItems((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );

    // Optional backend support (safe if endpoint exists)
    try {
      await api.put(`/admin/notifications/${id}/read`);
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading notifications…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Bell className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900">
          Notifications
        </h1>
      </div>

      {/* CARD */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications available
          </div>
        ) : (
          <ul className="divide-y">
            {items.map((n) => (
              <li
                key={n._id}
                className={`p-4 flex gap-4 cursor-pointer hover:bg-gray-50 ${
                  !n.isRead ? "bg-blue-50/40" : ""
                }`}
                onClick={() => {
                  if (n.orderId) {
                    navigate(`/orders/details?id=${n.orderId}`);
                  }
                  markAsRead(n._id);
                }}
              >
                {/* ICON */}
                <div className="mt-1">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      !n.isRead
                        ? "font-semibold text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* READ STATUS */}
                {!n.isRead && (
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
