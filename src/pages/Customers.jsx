import React, { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function Customers() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function load(p = 1) {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/customers', { params: { page: p, limit: 20 } });
      setRows(data.customers || []);
      setPages(data.pagination?.pages || 1);
      setPage(data.pagination?.current || p);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(1); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <div className="bg-white border rounded overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Total Spend</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="p-3" colSpan={4}>Loading...</td></tr>}
            {!loading && rows.length === 0 && <tr><td className="p-3" colSpan={4}>No customers</td></tr>}
            {!loading && rows.map((c) => (
              <tr key={c.userId} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.orders}</td>
                <td className="p-3">₹{c.totalSpend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button className="px-3 py-1 border rounded" disabled={page<=1} onClick={()=>load(page-1)}>Prev</button>
        <div className="text-sm">Page {page} / {pages}</div>
        <button className="px-3 py-1 border rounded" disabled={page>=pages} onClick={()=>load(page+1)}>Next</button>
      </div>
    </div>
  );
}
