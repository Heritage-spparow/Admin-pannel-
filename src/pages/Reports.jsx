import React, { useEffect, useState } from 'react';
import api from '../lib/api.js';

export default function Reports() {
  const [granularity, setGranularity] = useState('day');
  const [start, setStart] = useState(() => new Date(Date.now() - 30*24*60*60*1000).toISOString().slice(0,10));
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0,10));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/admin/reports/sales', { params: { granularity, start, end } });
      setRows(data.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reports & Analytics</h1>

      <div className="bg-white border rounded p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm">Granularity</label>
          <select className="border rounded px-2 py-1" value={granularity} onChange={e=>setGranularity(e.target.value)}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <label className="text-sm">Start</label>
          <input type="date" className="border rounded px-2 py-1" value={start} onChange={e=>setStart(e.target.value)} />
          <label className="text-sm">End</label>
          <input type="date" className="border rounded px-2 py-1" value={end} onChange={e=>setEnd(e.target.value)} />
          <button onClick={load} className="px-3 py-2 border rounded">Run</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td className="p-3" colSpan={3}>Loading...</td></tr>}
              {!loading && rows.length === 0 && <tr><td className="p-3" colSpan={3}>No data</td></tr>}
              {!loading && rows.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="p-3">{r.orders}</td>
                  <td className="p-3">₹{r.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
