import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { X, Search } from "lucide-react";

export default function ProductPickerModal({ open, onClose, onSelect }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;

    api
      .get("/products-enhanced", {
        params: { search },
      })
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .catch((err) => {
        console.error("Product fetch failed:", err);
      });
  }, [open, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-[420px] rounded-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Select Product</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-3 border-b">
          <div className="flex items-center border rounded-lg px-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              className="w-full p-2 outline-none"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {products.map((p) => (
            <div
              key={p._id}
              onClick={() => {
                onSelect(p);
                onClose();
              }}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
            >
              <img
                src={p.coverImage?.url}
                className="w-12 h-12 rounded border object-cover"
              />
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-gray-500">{p.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
