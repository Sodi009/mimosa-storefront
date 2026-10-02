"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getUploadUrl, saveProductAction } from "../../actions";
import { supabasePublic } from "@/lib/supabase-public";

const CATEGORIES = [
  { value: "bags", label: "Bags" },
  { value: "clothes", label: "Clothes" },
  { value: "innerwear", label: "Innerwears" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
];

function slugify(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseValues(str) {
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

function buildCombos(opt1Name, opt1Values, opt2Name, opt2Values) {
  if (!opt1Values.length) return [{ title: "Default", selectedOptions: [] }];
  if (!opt2Values.length) {
    return opt1Values.map((v1) => ({
      title: v1,
      selectedOptions: [{ name: opt1Name, value: v1 }],
    }));
  }
  const combos = [];
  for (const v1 of opt1Values) {
    for (const v2 of opt2Values) {
      combos.push({
        title: `${v1} / ${v2}`,
        selectedOptions: [
          { name: opt1Name, value: v1 },
          { name: opt2Name, value: v2 },
        ],
      });
    }
  }
  return combos;
}

function initVariantsFromProduct(product) {
  const map = {};
  (product?.product_variants || []).forEach((v) => {
    map[v.title] = {
      price: String(v.price),
      stock: String(v.stock),
      sku: v.sku || "",
      imageUrl: v.image_url || "",
    };
  });
  return map;
}

export default function ProductForm({ product }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState(product?.title || "");
  const [handle, setHandle] = useState(product?.handle || "");
  const [handleTouched, setHandleTouched] = useState(Boolean(product));
  const [category, setCategory] = useState(product?.category || CATEGORIES[0].value);
  const [description, setDescription] = useState(product?.description || "");
  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);

  const opt1 = product?.options?.[0];
  const opt2 = product?.options?.[1];
  const [opt1Name, setOpt1Name] = useState(opt1?.name || "");
  const [opt1ValuesStr, setOpt1ValuesStr] = useState(opt1?.values?.join(", ") || "");
  const [opt2Name, setOpt2Name] = useState(opt2?.name || "");
  const [opt2ValuesStr, setOpt2ValuesStr] = useState(opt2?.values?.join(", ") || "");

  const [variantValues, setVariantValues] = useState(() => initVariantsFromProduct(product));

  useEffect(() => {
    if (!handleTouched) setHandle(slugify(title));
  }, [title, handleTouched]);

  const opt1Values = parseValues(opt1ValuesStr);
  const opt2Values = parseValues(opt2ValuesStr);
  const combos = buildCombos(opt1Name || "Option", opt1Values, opt2Name || "Option 2", opt2Values);

  function updateVariantField(comboTitle, field, value) {
    setVariantValues((prev) => ({
      ...prev,
      [comboTitle]: { ...(prev[comboTitle] || {}), [field]: value },
    }));
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setFormError("");
    try {
      for (const file of files) {
        const { path, token, publicUrl } = await getUploadUrl(file.name);
        const { error } = await supabasePublic.storage
          .from("product-images")
          .uploadToSignedUrl(path, token, file);
        if (error) throw new Error(error.message);
        setImages((prev) => [...prev, { url: publicUrl, altText: title }]);
      }
    } catch (err) {
      setFormError(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(url) {
    setImages((prev) => prev.filter((img) => img.url !== url));
  }

  function moveImageFirst(url) {
    setImages((prev) => {
      const img = prev.find((i) => i.url === url);
      return img ? [img, ...prev.filter((i) => i.url !== url)] : prev;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) return setFormError("Title is required.");
    if (!images.length) return setFormError("Add at least one photo.");

    const variants = combos.map((c) => {
      const v = variantValues[c.title] || {};
      return {
        title: c.title,
        selectedOptions: c.selectedOptions,
        price: Number(v.price),
        stock: Number(v.stock) || 0,
        sku: v.sku || "",
        imageUrl: v.imageUrl || "",
        currencyCode: "AED",
      };
    });

    if (variants.some((v) => !v.price || Number.isNaN(v.price) || v.price <= 0)) {
      return setFormError("Every size/style needs a price greater than 0.");
    }

    const options = [];
    if (opt1Name && opt1Values.length) options.push({ name: opt1Name, values: opt1Values });
    if (opt2Name && opt2Values.length) options.push({ name: opt2Name, values: opt2Values });

    const fd = new FormData();
    if (product?.id) fd.set("id", product.id);
    fd.set("title", title.trim());
    fd.set("handle", handle);
    fd.set("category", category);
    fd.set("description", description);
    fd.set("images", JSON.stringify(images));
    fd.set("options", JSON.stringify(options));
    fd.set("variants", JSON.stringify(variants));

    startTransition(async () => {
      try {
        await saveProductAction(fd);
        router.push("/admin/products");
      } catch (err) {
        setFormError(err.message || "Something went wrong saving this product.");
      }
    });
  }

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      {formError && <p className="admin-login-error">{formError}</p>}

      <label className="admin-field">
        <span>Title</span>
        <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <label className="admin-field">
        <span>URL handle</span>
        <input
          name="handle"
          value={handle}
          onChange={(e) => {
            setHandleTouched(true);
            setHandle(slugify(e.target.value));
          }}
          required
        />
      </label>

      <label className="admin-field">
        <span>Category</span>
        <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </label>

      <label className="admin-field">
        <span>Description</span>
        <textarea name="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <div className="admin-field">
        <span>Photos</span>
        <div className="admin-image-grid">
          {images.map((img, i) => (
            <div className="admin-image-thumb" key={img.url}>
              <img src={img.url} alt="" />
              {i === 0 && <span className="admin-image-featured">Cover</span>}
              <div className="admin-image-thumb-actions">
                {i !== 0 && (
                  <button type="button" onClick={() => moveImageFirst(img.url)}>Make cover</button>
                )}
                <button type="button" onClick={() => removeImage(img.url)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading} />
        {uploading && <p className="admin-uploading">Uploading…</p>}
      </div>

      <div className="admin-options-grid">
        <label className="admin-field">
          <span>Option 1 name (e.g. Style)</span>
          <input value={opt1Name} onChange={(e) => setOpt1Name(e.target.value)} placeholder="Style" />
        </label>
        <label className="admin-field">
          <span>Option 1 values (comma separated)</span>
          <input value={opt1ValuesStr} onChange={(e) => setOpt1ValuesStr(e.target.value)} placeholder="1, 2, 3" />
        </label>
        <label className="admin-field">
          <span>Option 2 name (e.g. Size)</span>
          <input
            value={opt2Name}
            onChange={(e) => setOpt2Name(e.target.value)}
            placeholder="Size"
            disabled={!opt1Values.length}
          />
        </label>
        <label className="admin-field">
          <span>Option 2 values (comma separated)</span>
          <input
            value={opt2ValuesStr}
            onChange={(e) => setOpt2ValuesStr(e.target.value)}
            placeholder="34, 36, 38"
            disabled={!opt1Values.length}
          />
        </label>
      </div>

      <div className="admin-field">
        <span>Price &amp; stock {combos.length > 1 ? "per option" : ""}</span>
        <table className="admin-table admin-variant-table">
          <thead>
            <tr>
              <th>{combos.length > 1 ? "Option" : ""}</th>
              <th>Price (AED)</th>
              <th>Stock</th>
              <th>SKU (optional)</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((c) => {
              const v = variantValues[c.title] || {};
              return (
                <tr key={c.title}>
                  <td>{combos.length > 1 ? c.title : "—"}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={v.price || ""}
                      onChange={(e) => updateVariantField(c.title, "price", e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={v.stock ?? ""}
                      onChange={(e) => updateVariantField(c.title, "stock", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={v.sku || ""}
                      onChange={(e) => updateVariantField(c.title, "sku", e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="admin-form-actions">
        <button type="button" className="btn-secondary" onClick={() => router.push("/admin/products")}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={pending || uploading}>
          {pending ? "Saving…" : "Save product"}
        </button>
      </div>
    </form>
  );
}
