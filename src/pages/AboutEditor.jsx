import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/* =========================
   TIPTAP EDITOR
========================= */
function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md p-3 bg-white">
      <EditorContent editor={editor} />
    </div>
  );
}

/* =========================
   ABOUT EDITOR
========================= */
export default function AboutEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [about, setAbout] = useState({
    hero: { brandName: "", tagline: "", logo: "" },
    story: { content: "" },
    cta: { buttonText: "", categorySlug: "" },
  });

  /* =====================
     FETCH ABOUT PAGE
  ====================== */
  async function fetchAbout() {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/about");
      if (data?.data) setAbout(data.data);
    } catch {
      toast.error("Failed to load About page");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAbout();
  }, []);

  /* =====================
     UPDATE HELPER
  ====================== */
  const update = (path, value) => {
    setAbout((prev) => {
      const copy = structuredClone(prev);
      let ref = copy;
      path.slice(0, -1).forEach((k) => (ref = ref[k]));
      ref[path.at(-1)] = value;
      return copy;
    });
  };

  /* =====================
     IMAGE UPLOAD
  ====================== */
  async function uploadImage(file, path) {
    const form = new FormData();
    form.append("file", file);

    try {
      const { data } = await api.post("/admin/upload", form);
      update(path, data.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    }
  }

  /* =====================
     SAVE
  ====================== */
  async function save() {
    setSaving(true);
    try {
      await api.post("/admin/about", about);
      toast.success("About page saved");
      fetchAbout();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white border rounded">
        <span className="text-gray-500">Loading About page…</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 p-8">
      {/* ================= EDIT PANEL ================= */}
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit About Page
          </h1>
          <p className="text-gray-600">
            Manage content shown on the About page
          </p>
        </header>

        {/* HERO */}
        <Section title="Hero Section">
          <Input
            label="Brand Name"
            value={about.hero.brandName}
            onChange={(v) => update(["hero", "brandName"], v)}
          />
          <Input
            label="Tagline"
            value={about.hero.tagline}
            onChange={(v) => update(["hero", "tagline"], v)}
          />
          <ImageUpload
            label="Logo"
            image={about.hero.logo}
            onUpload={(f) => uploadImage(f, ["hero", "logo"])}
          />
        </Section>

        {/* STORY */}
        <Section title="Story Content">
          <RichTextEditor
            value={about.story.content}
            onChange={(v) => update(["story", "content"], v)}
          />
        </Section>

        {/* CTA */}
        <Section title="CTA">
          <Input
            label="Button Text"
            value={about.cta.buttonText}
            onChange={(v) => update(["cta", "buttonText"], v)}
          />
          <Input
            label="Category Slug"
            value={about.cta.categorySlug}
            onChange={(v) => update(["cta", "categorySlug"], v)}
          />
        </Section>

        <button
          onClick={save}
          disabled={saving}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          {saving ? "Saving…" : "Save About Page"}
        </button>
      </div>

      {/* ================= LIVE PREVIEW ================= */}
      <div className="border rounded-lg bg-white p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Live Preview</h2>

        {about.hero.logo && (
          <img
            src={about.hero.logo}
            alt="Logo"
            className="h-16 mb-4"
          />
        )}

        <h1 className="text-3xl font-light mb-2">
          {about.hero.brandName}
        </h1>
        <p className="text-gray-600 mb-6">
          {about.hero.tagline}
        </p>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: about.story.content }}
        />

        <button className="mt-8 bg-black text-white px-4 py-2">
          {about.cta.buttonText}
        </button>
      </div>
    </div>
  );
}

/* =========================
   UI HELPERS
========================= */
const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    {children}
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

const ImageUpload = ({ label, image, onUpload }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {image && (
      <img
        src={image}
        alt="Preview"
        className="h-20 mb-2 border rounded"
      />
    )}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => onUpload(e.target.files[0])}
    />
  </div>
);
