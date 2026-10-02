import { supabasePublic } from "./supabase-public";

// Shaped to match what Shopify's Storefront API used to return, so the
// existing product components (ProductCard, ProductDetail, ProductGallery,
// collection/home pages) didn't need to change when the catalog moved off
// Shopify and onto our own Supabase database.

export const CATEGORIES = ["bags", "clothes", "shoes", "accessories", "innerwear"];

function toMoney(amount, currencyCode) {
  return { amount: String(amount), currencyCode };
}

function priceRangeFromVariants(variants) {
  const prices = variants.map((v) => Number(v.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const currencyCode = variants[0]?.currency_code || "AED";
  return {
    minVariantPrice: toMoney(min, currencyCode),
    maxVariantPrice: toMoney(max, currencyCode),
  };
}

function toProductCard(row) {
  const variants = row.product_variants || [];
  const inStock = variants.some((v) => v.stock > 0);
  const images = row.images || [];
  return {
    id: row.id,
    handle: row.handle,
    title: row.title,
    availableForSale: inStock,
    featuredImage: images[0] ? { url: images[0].url, altText: images[0].altText || row.title } : null,
    priceRange: variants.length ? priceRangeFromVariants(variants) : null,
  };
}

function toFullProduct(row) {
  const variants = row.product_variants || [];
  const images = (row.images || []).map((img) => ({
    url: img.url,
    altText: img.altText || row.title,
    width: img.width || null,
    height: img.height || null,
  }));

  return {
    id: row.id,
    handle: row.handle,
    title: row.title,
    description: row.description || "",
    descriptionHtml: row.description || "",
    images: { edges: images.map((node) => ({ node })) },
    priceRange: variants.length ? priceRangeFromVariants(variants) : null,
    options: row.options || [],
    minQuantity: row.min_quantity || 1,
    variants: {
      edges: variants.map((v) => ({
        node: {
          id: v.id,
          title: v.title,
          availableForSale: v.stock > 0,
          price: toMoney(v.price, v.currency_code),
          image: v.image_url ? { url: v.image_url, altText: row.title } : null,
          selectedOptions: v.selected_options || [],
        },
      })),
    },
  };
}

export async function getProducts({ first = 12 } = {}) {
  const { data, error } = await supabasePublic
    .from("products")
    .select("*, product_variants(*)")
    .order("created_at", { ascending: false })
    .limit(first);

  if (error) {
    console.error("getProducts failed:", error.message);
    throw new Error(error.message);
  }

  return (data || []).map(toProductCard);
}

export async function getProductByHandle(handle) {
  const { data, error } = await supabasePublic
    .from("products")
    .select("*, product_variants(*)")
    .eq("handle", handle)
    .maybeSingle();

  if (error) {
    console.error("getProductByHandle failed:", error.message);
    throw new Error(error.message);
  }
  if (!data) return null;

  return toFullProduct(data);
}

export async function getProductsByCategory(category, { first = 100 } = {}) {
  if (!CATEGORIES.includes(category)) return [];

  const { data, error } = await supabasePublic
    .from("products")
    .select("*, product_variants(*)")
    .eq("category", category)
    .order("created_at", { ascending: false })
    .limit(first);

  if (error) {
    console.error("getProductsByCategory failed:", error.message);
    throw new Error(error.message);
  }

  return (data || []).map(toProductCard);
}
