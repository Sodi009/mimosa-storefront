"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getUploadUrl, saveProductAction } from "../../actions";
import { supabasePublic } from "@/lib/supabase-public";
import { compressImage } from "@/lib/compress-image";

const CATEGORIES = [
  { value: "bags", label: "Bags" },
  { value: "tops", label: "Tops" },
  { value: "dresses", label: "Dresses" },
  { value: "bottoms", label: "Bottoms" },
  { value: "innerwear", label: "Innerwears" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
  { value: "supplements", label: "Supplements" },
  { value: "beauty-cosmetics", label: "Beauty & Cosmetic" },
  { value: "hair-tools", label: "Hair Tools" },
  { value: "foods", label: "Foods" },
  { value: "contact-lens-glasses", label: "Contact Lens and Glasses" },
  { value: "sister-hood-bras", label: "Sister Hood Bras" },
  { value: "wallet", label: "Wallet" },
];

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
    map[v.title] = { inStock: v.stock > 0 };
  });
  return map;
}

// Maps each Option 1 value (e.g. a color/style) to the photo that should show
// when a shopper picks it — read back from whichever variant already carried
// that photo, so editing a product keeps its existing picks.
function initOptionImageMap(product) {
  const map = {};
  const opt1Name = product?.options?.[0]?.name;
  if (!opt1Name) return map;
  (product?.product_variants || []).forEach((v) => {
    const opt = (v.selected_options || []).find((o) => o.name === opt1Name);
    if (opt && v.image_url && !map[opt.value]) map[opt.value] = v.image_url;
  });
  return map;
}

export default function ProductForm({ product }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState(product?.title || "");
  const [category, setCategory] = useState(product?.category || CATEGORIES[0].value);
  const [description, setDescription] = useState(product?.description || "");
  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [minQuantity, setMinQuantity] = useState(String(product?.min_quantity || 1));

  const opt1 = product?.options?.[0];
  const opt2 = product?.options?.[1];
  const [opt1Name, setOpt1Name] = useState(opt1?.name || "");
  const [opt1ValuesStr, setOpt1ValuesStr] = useState(opt1?.values?.join(", ") || "");
  const [opt2Name, setOpt2Name] = useState(opt2?.name || "");
  const [opt2ValuesStr, setOpt2ValuesStr] = useState(opt2?.values?.join(", ") || "");

  const [variantValues, setVariantValues] = useState(() => initVariantsFromProduct(product));
  const [optionImageMap, setOptionImageMap] = useState(() => initOptionImageMap(product));

  // The rough price shown to customers (e.g. "Around AED 25 – 30") — not
  // tied to any one size/style. The exact price is confirmed with the
  // customer on WhatsApp, so there's no need to set a price per option.
  const firstVariantPrice = product?.product_variants?.[0]?.price;
  const [priceFrom, setPriceFrom] = useState(
    product?.price_from != null
      ? String(product.price_from)
      : firstVariantPrice != null
      ? String(firstVariantPrice)
      : ""
  );
  const [priceTo, setPriceTo] = useState(product?.price_to != null ? String(product.price_to) : "");

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
        const compressed = await compressImage(file);
        const { path, token, publicUrl } = await getUploadUrl(compressed.name);
        const { error } = await supabasePublic.storage
          .from("product-images")
          .uploadToSignedUrl(path, token, compressed);
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

    const from = Number(priceFrom);
    if (!from || from <= 0) return setFormError("Enter a price.");
    const to = Number(priceTo);
    // One internal price per unit (for cart totals/invoices) — the site
    // shows the rough From/To range, not this exact number.
    const internalPrice = to > from ? (from + to) / 2 : from;

    const variants = combos.map((c) => {
      const v = variantValues[c.title] || {};
      const opt1Value = c.selectedOptions[0]?.value;
      return {
        title: c.title,
        selectedOptions: c.selectedOptions,
        price: internalPrice,
        stock: v.inStock === false ? 0 : 999,
        currencyCode: "AED",
        imageUrl: (opt1Value && optionImageMap[opt1Value]) || "",
      };
    });

    const options = [];
    if (opt1Name && opt1Values.length) options.push({ name: opt1Name, values: opt1Values });
    if (opt2Name && opt2Values.length) options.push({ name: opt2Name, values: opt2Values });

    const fd = new FormData();
    if (product?.id) {
      fd.set("id", product.id);
      fd.set("handle", product.handle);
    }
    fd.set("title", title.trim());
    fd.set("category", category);
    fd.set("description", description);
    fd.set("minQuantity", String(Math.max(1, Number(minQuantity) || 1)));
    fd.set("priceFrom", String(from));
    fd.set("priceTo", to > from ? String(to) : "");
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

      <label className="admin-field">
        <span>Minimum different sizes/styles</span>
        <input
          type="number"
          min="1"
          step="1"
          value={minQuantity}
          onChange={(e) => setMinQuantity(e.target.value)}
          style={{ maxWidth: 120 }}
        />
        <span className="admin-section-hint" style={{ margin: "4px 0 0" }}>
          Leave at 1 for no minimum. Set to 2, 3, etc. to require customers pick at least that many
          different sizes/styles before checkout — buying 2 of the same one won't count.
        </span>
      </label>

      <div className="admin-price-range-tool">
        <p className="admin-option-group-title" style={{ marginBottom: 10 }}>
          Price shown to customers
        </p>
        <div className="admin-price-range-row">
          <label className="admin-field" style={{ marginBottom: 0 }}>
            <span>From (AED)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              placeholder="e.g. 25"
              required
            />
          </label>
          <label className="admin-field" style={{ marginBottom: 0 }}>
            <span>To (AED, optional)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              placeholder="e.g. 30"
            />
          </label>
        </div>
        <p className="admin-section-hint" style={{ margin: "8px 0 0" }}>
          Customers see a rough price ("Around AED 25 – 30"), not an exact number — same price shown
          for every size/style. Confirm the real price with the customer on WhatsApp when they order.
          Leave "To" blank to show one exact price instead of a range.
        </p>
      </div>

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

      <p className="admin-section-hint">
        Does this come in different sizes or styles, like the Soft Bra does (Style 1–5, Size 34–40)?
        If it's just one item with one price, skip this and leave both boxes below empty.
      </p>

      <div className="admin-option-group">
        <p className="admin-option-group-title">First choice (optional)</p>
        <div className="admin-options-grid">
          <label className="admin-field">
            <span>What do you call it?</span>
            <input value={opt1Name} onChange={(e) => setOpt1Name(e.target.value)} placeholder="e.g. Style, Color" />
          </label>
          <label className="admin-field">
            <span>List the choices, separated by commas</span>
            <input value={opt1ValuesStr} onChange={(e) => setOpt1ValuesStr(e.target.value)} placeholder="e.g. 1, 2, 3" />
          </label>
        </div>
      </div>

      <div className="admin-option-group">
        <p className="admin-option-group-title">Second choice (optional)</p>
        <div className="admin-options-grid">
          <label className="admin-field">
            <span>What do you call it?</span>
            <input
              value={opt2Name}
              onChange={(e) => setOpt2Name(e.target.value)}
              placeholder="e.g. Size"
              disabled={!opt1Values.length}
            />
          </label>
          <label className="admin-field">
            <span>List the choices, separated by commas</span>
            <input
              value={opt2ValuesStr}
              onChange={(e) => setOpt2ValuesStr(e.target.value)}
              placeholder="e.g. 34, 36, 38"
              disabled={!opt1Values.length}
            />
          </label>
        </div>
        {!opt1Values.length && (
          <p className="admin-section-hint">Fill in "First choice" above before adding a second one.</p>
        )}
      </div>

      {opt1Values.length > 0 && images.length > 0 && (
        <div className="admin-field">
          <span>Photo for each {opt1Name || "option"} (tap a photo to link it — optional)</span>
          {opt1Values.map((val) => (
            <div className="admin-option-image-row" key={val}>
              <span className="admin-option-image-label">{val}</span>
              <div className="admin-option-image-choices">
                {images.map((img) => (
                  <button
                    type="button"
                    key={img.url}
                    className={`admin-option-image-choice ${optionImageMap[val] === img.url ? "selected" : ""}`}
                    onClick={() =>
                      setOptionImageMap((prev) => ({
                        ...prev,
                        [val]: prev[val] === img.url ? undefined : img.url,
                      }))
                    }
                  >
                    <img src={img.url} alt="" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-field">
        <span>{combos.length > 1 ? "Stock per option" : "In stock"}</span>
        <table className="admin-table admin-variant-table">
          <thead>
            <tr>
              <th>{combos.length > 1 ? "Option" : ""}</th>
              <th>In stock</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((c) => {
              const v = variantValues[c.title] || {};
              const checked = v.inStock !== false;
              return (
                <tr key={c.title}>
                  <td>{combos.length > 1 ? c.title : "—"}</td>
                  <td className="admin-instock-cell">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => updateVariantField(c.title, "inStock", e.target.checked)}
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
