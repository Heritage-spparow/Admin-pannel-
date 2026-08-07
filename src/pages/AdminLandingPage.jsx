import React, { useEffect, useState } from "react";
import { landingAPI, productAPI } from "../api/api";
import ProductPickerModal from "./ProductPickerModal";
import { toast } from "react-toastify";

export default function AdminLandingPage() {
  const [loading, setLoading] = useState(false);
  const [pickerIndex, setPickerIndex] = useState(null);

  const [collections, setCollections] = useState([]);

  const [data, setData] = useState({
    sectionOne: {
      collection: "",
      ctaLabel: "Explore Collection",
    },

    sectionTwo: {
      ctaLabel: "Shop Now",
      items: [],
    },

    sectionThree: {
      link: "/campaign",
      ctaLabel: "Explore Campaign",
    },
  });

  const [images, setImages] = useState({
    sectionOne: null,
    sectionThree: null,
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [landingRes, collectionsRes] = await Promise.all([
          landingAPI.get(),
          productAPI.getCollections(),
        ]);

        setCollections(collectionsRes.data.collections || []);

        if (!landingRes.data?.landing) return;

        const l = landingRes.data.landing;

        setData({
          sectionOne: {
            collection: l.sectionOne?.collection || "",
            ctaLabel: l.sectionOne?.ctaLabel || "Explore Collection",
          },

          sectionTwo: {
            ctaLabel: l.sectionTwo?.ctaLabel || "Shop Now",

            items:
              l.sectionTwo?.items?.map((i) => ({
                productId: i.productId?._id || i.productId,
                productName: i.productId?.name || "",
                label: i.label || "",
                image: i.image,
              })) || [],
          },

          sectionThree: {
            link: l.sectionThree?.link || "/campaign",

            ctaLabel: l.sectionThree?.ctaLabel || "Explore Campaign",
          },
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load landing page");
      }
    };

    loadData();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();

      /* ================= SECTION ONE ================= */

      fd.append("sectionOneCollection", data.sectionOne.collection);

      fd.append("sectionOneCta", data.sectionOne.ctaLabel);

      if (images.sectionOne) {
        fd.append("sectionOneCoverImage", images.sectionOne);
      }

      /* ================= SECTION 2 ================= */

      fd.append("sectionTwoCta", data.sectionTwo.ctaLabel);

      const cleanCarouselItems = data.sectionTwo.items.map(
        ({ file, productName, ...rest }) => rest,
      );

      fd.append("carouselItems", JSON.stringify(cleanCarouselItems));

      data.sectionTwo.items.forEach((item) => {
        if (item.file) {
          fd.append("carouselImages", item.file);
        }
      });

      /* ================= SECTION 3 ================= */

      fd.append("sectionThreeLink", data.sectionThree.link);

      fd.append("sectionThreeCta", data.sectionThree.ctaLabel);

      if (images.sectionThree) {
        fd.append("sectionThreeImage", images.sectionThree);
      }

      await landingAPI.update(fd);

      toast.success("Landing page updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save landing page");
    } finally {
      setLoading(false);
    }
  };

/* ================= UI ================= */
return (
  <div className="space-y-8">
    <h1 className="text-2xl font-bold">Landing Page CMS</h1>

    {/* ================= SECTION 1 ================= */}
    <div className="bg-white border rounded-lg p-6 space-y-5">
      <h2 className="font-semibold text-lg">
        Section 1 – Featured Collection
      </h2>

      <div>
        <label className="block text-sm font-medium mb-2">
          Collection
        </label>

        <select
          className="w-full border rounded-lg p-3"
          value={data.sectionOne.collection}
          onChange={(e) =>
            setData((p) => ({
              ...p,
              sectionOne: {
                ...p.sectionOne,
                collection: e.target.value,
              },
            }))
          }
        >
          <option value="">Select Collection</option>

          {collections.map((collection) => (
            <option key={collection} value={collection}>
              {collection}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          CTA Button
        </label>

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Explore Collection"
          value={data.sectionOne.ctaLabel}
          onChange={(e) =>
            setData((p) => ({
              ...p,
              sectionOne: {
                ...p.sectionOne,
                ctaLabel: e.target.value,
              },
            }))
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Collection Cover Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImages((p) => ({
              ...p,
              sectionOne: e.target.files[0],
            }))
          }
        />
      </div>
    </div>

    {/* ================= SECTION 2 ================= */}

    <div className="bg-white border rounded-lg p-6 space-y-4">
      <h2 className="font-semibold text-lg">
        Section 2 – Featured Products
      </h2>

      {data.sectionTwo.items.map((item, idx) => (
        <div
          key={idx}
          className="grid grid-cols-3 gap-3 items-center"
        >
          <button
            onClick={() => setPickerIndex(idx)}
            className="border rounded-lg p-3 text-left hover:bg-gray-50"
          >
            {item.productName || "Select Product"}
          </button>

          <input
            className="border rounded-lg p-3"
            placeholder="Display Label"
            value={item.label || ""}
            onChange={(e) => {
              const items = [...data.sectionTwo.items];
              items[idx].label = e.target.value;

              setData((p) => ({
                ...p,
                sectionTwo: {
                  ...p.sectionTwo,
                  items,
                },
              }));
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const items = [...data.sectionTwo.items];
              items[idx].file = e.target.files[0];

              setData((p) => ({
                ...p,
                sectionTwo: {
                  ...p.sectionTwo,
                  items,
                },
              }));
            }}
          />
        </div>
      ))}

      <button
        onClick={() =>
          setData((p) => ({
            ...p,
            sectionTwo: {
              ...p.sectionTwo,
              items: [...p.sectionTwo.items, {}],
            },
          }))
        }
        className="text-blue-600 font-medium"
      >
        + Add Carousel Slide
      </button>
    </div>

    {/* ================= SECTION 3 ================= */}

    <div className="bg-white border rounded-lg p-6 space-y-5">
      <h2 className="font-semibold text-lg">
        Section 3 – Campaign
      </h2>

      <input
        className="w-full border rounded-lg p-3"
        placeholder="/campaign"
        value={data.sectionThree.link}
        onChange={(e) =>
          setData((p) => ({
            ...p,
            sectionThree: {
              ...p.sectionThree,
              link: e.target.value,
            },
          }))
        }
      />

      <input
        className="w-full border rounded-lg p-3"
        placeholder="Explore Campaign"
        value={data.sectionThree.ctaLabel}
        onChange={(e) =>
          setData((p) => ({
            ...p,
            sectionThree: {
              ...p.sectionThree,
              ctaLabel: e.target.value,
            },
          }))
        }
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImages((p) => ({
            ...p,
            sectionThree: e.target.files[0],
          }))
        }
      />
    </div>

    {/* ================= SAVE ================= */}

    <button
      onClick={handleSave}
      disabled={loading}
      className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
    >
      {loading ? "Saving..." : "Save Landing Page"}
    </button>

    {/* ================= PRODUCT PICKER ================= */}

    <ProductPickerModal
      open={pickerIndex !== null}
      onClose={() => setPickerIndex(null)}
      onSelect={(product) => {
        const items = [...data.sectionTwo.items];

        items[pickerIndex] = {
          ...items[pickerIndex],
          productId: product._id,
          productName: product.name,
        };

        setData((p) => ({
          ...p,
          sectionTwo: {
            ...p.sectionTwo,
            items,
          },
        }));
      }}
    />
  </div>
);
}
