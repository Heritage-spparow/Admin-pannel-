import React, { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threshold, setThreshold] = useState(10);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('admin/inventory/low-stock', { params: { threshold, limit: 100 } });
      setItems(data.products || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inventory & Stock</h1>
        <div className="space-x-2">
          <label className="text-sm">Threshold</label>
          <input type="number" className="border rounded px-2 py-1 w-20" value={threshold} onChange={e=>setThreshold(Number(e.target.value))} />
          <button onClick={load} className="px-3 py-2 border rounded">Refresh</button>
        </div>
      </div>
      <div className="bg-white border rounded overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="p-3" colSpan={4}>Loading...</td></tr>}
            {!loading && items.length === 0 && <tr><td className="p-3" colSpan={4}>No low-stock products</td></tr>}
            {!loading && items.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.sku || '-'}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.active ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
