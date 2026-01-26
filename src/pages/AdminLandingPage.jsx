import React, { useEffect, useState } from "react";
import { landingAPI } from "../api/api";
import ProductPickerModal from "./ProductPickerModal";
import { toast } from "react-toastify";

export default function AdminLandingPage() {
  const [loading, setLoading] = useState(false);
  const [pickerIndex, setPickerIndex] = useState(null);

  /* ================= STATE ================= */
  const [data, setData] = useState({
    sectionOne: {
      category: "",
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
    landingAPI
      .get()
      .then((res) => {
        if (!res.data?.landing) return;

        const l = res.data.landing;

        setData({
          sectionOne: {
            category: l.sectionOne?.category || "",
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
            ctaLabel:
              l.sectionThree?.ctaLabel || "Explore Campaign",
          },
        });
      })
      .catch(() => toast.error("Failed to load landing page"));
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();

      // ---------- SECTION 1 ----------
      fd.append("sectionOneCategory", data.sectionOne.category);
      fd.append("sectionOneCta", data.sectionOne.ctaLabel);
      if (images.sectionOne) {
        fd.append("sectionOneImage", images.sectionOne);
      }

      // ---------- SECTION 2 ----------
      fd.append("sectionTwoCta", data.sectionTwo.ctaLabel);

      const cleanCarouselItems = data.sectionTwo.items.map(
        ({ file, productName, ...rest }) => rest
      );
      fd.append("carouselItems", JSON.stringify(cleanCarouselItems));

      data.sectionTwo.items.forEach((item) => {
        if (item.file) fd.append("carouselImages", item.file);
      });

      // ---------- SECTION 3 ----------
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
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">Section 1 – Hero</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Category (women / bridal)"
          value={data.sectionOne.category}
          onChange={(e) =>
            setData((p) => ({
              ...p,
              sectionOne: {
                ...p.sectionOne,
                category: e.target.value,
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
              sectionOne: e.target.files[0],
            }))
          }
        />
      </div>

      {/* ================= SECTION 2 ================= */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">Section 2 – Carousel</h2>

        {data.sectionTwo.items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPickerIndex(idx)}
              className="border p-2 rounded text-left"
            >
              {item.productName || "Select Product"}
            </button>

            <input
              className="border p-2 rounded"
              placeholder="Label (Basant)"
              value={item.label || ""}
              onChange={(e) => {
                const items = [...data.sectionTwo.items];
                items[idx].label = e.target.value;
                setData((p) => ({
                  ...p,
                  sectionTwo: { ...p.sectionTwo, items },
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
                  sectionTwo: { ...p.sectionTwo, items },
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
          className="text-sm text-blue-600"
        >
          + Add Carousel Slide
        </button>
      </div>

      {/* ================= SECTION 3 ================= */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold">Section 3 – Campaign</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Campaign Link"
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
        className="px-6 py-3 bg-black text-white rounded"
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
            sectionTwo: { ...p.sectionTwo, items },
          }));
        }}
      />
    </div>
  );
}
