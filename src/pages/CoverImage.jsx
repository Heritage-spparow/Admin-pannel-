import React, { useEffect, useState } from "react";
import { collectionAPI } from "../api/api";
import { toast } from "react-toastify";

export default function CoverImage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const res = await collectionAPI.getAll();
      console.log(res) ;
      setCollections(res.data.collections || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load collections");
    }
  };

  const handleUpload = async (name, file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("coverImage", file);

      await collectionAPI.updateCoverImage(name, formData);

      toast.success("Cover image updated");

      loadCollections();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm("Delete this cover image?")) return;

    try {
      await collectionAPI.deleteCoverImage(name);

      toast.success("Cover removed");

      loadCollections();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-semibold mb-8">
        Collection Cover Images
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {collections.map((collection) => (
          <div
            key={collection._id}
            className="border rounded-xl p-5 bg-white shadow-sm"
          >
            <h2 className="text-xl font-medium mb-4">
              {collection.name}
            </h2>

            <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden mb-4">

              {collection.coverImage?.url ? (
                <img
                  src={collection.coverImage.url}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Cover Image
                </div>
              )}
            </div>

            <div className="flex gap-3">

              <label className="flex-1">

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleUpload(
                      collection.name,
                      e.target.files[0]
                    )
                  }
                />

                <div className="cursor-pointer bg-black text-white rounded-lg py-2 text-center hover:bg-gray-800">
                  Upload
                </div>

              </label>

              {collection.coverImage?.url && (
                <button
                  onClick={() =>
                    handleDelete(collection.name)
                  }
                  className="px-5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              )}

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}