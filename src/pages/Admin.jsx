import React, { useEffect, useState } from "react";
import {
  Shield,
  UserCheck,
  UserX,
  Trash2,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import { adminAPI } from "../api/api";

/* ========================
   Status Pill
======================== */
const StatusPill = ({ status }) => {
  const map = {
    active: "bg-green-100 text-green-700",
    suspended: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
};

/* ========================
   Admin Page
======================== */
export default function Admin() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const { data } = await adminAPI.getAdmins();
      setAdmins(data.admins || []);
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const toggleStatus = async (admin) => {
    try {
      await adminAPI.toggleAdminStatus(admin._id);
      toast.success("Admin status updated");
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action not allowed");
    }
  };

  const deleteAdmin = async (admin) => {
    if (!window.confirm(`Delete admin ${admin.email}?`)) return;

    try {
      await adminAPI.deleteAdmin(admin._id);
      toast.success("Admin deleted");
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Loading admins…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-gray-900">
          Admin Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage system administrators
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Admins" value={admins.length} />
        <StatCard
          label="Active"
          value={admins.filter(a => a.accountStatus === "active").length}
        />
        <StatCard
          label="Suspended"
          value={admins.filter(a => a.accountStatus === "suspended").length}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">
            Administrators
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Admin</th>
                <th className="px-6 py-3 text-left font-medium">Role</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Joined</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {admins.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50">
                  {/* Admin */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {a.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {a._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      admin
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusPill status={a.accountStatus} />
                  </td>

                  {/* Joined */}
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => toggleStatus(a)}
                        className="p-2 border rounded-lg hover:bg-gray-100"
                        title="Suspend / Activate"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAdmin(a)}
                        className="p-2 border rounded-lg text-red-600 hover:bg-red-50"
                        title="Delete admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {admins.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No admins found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================
   Stat Card
======================== */
const StatCard = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);
