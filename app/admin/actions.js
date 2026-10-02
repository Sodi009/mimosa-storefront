"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  verifyPassword,
  verifySessionToken,
} from "@/lib/admin-auth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};

async function assertAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    throw new Error("Unauthorized");
  }
}

export async function loginAction(formData) {
  const password = String(formData.get("password") || "");
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, createSessionToken(), COOKIE_OPTIONS);
  redirect("/admin/products");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

// Returns a one-time signed URL the browser can upload a file to directly,
// so large product photos never pass through a Server Action (which caps
// request bodies at 1MB) or the hosting platform's function body limit.
export async function getUploadUrl(fileName) {
  await assertAdmin();
  const ext = fileName.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from("product-images")
    .createSignedUploadUrl(path);

  if (error) throw new Error(error.message);

  const { data: pub } = supabaseAdmin.storage.from("product-images").getPublicUrl(path);

  return { path, token: data.token, publicUrl: pub.publicUrl };
}

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uniqueHandle(desired, excludeId) {
  let handle = desired;
  let n = 2;
  for (;;) {
    let query = supabaseAdmin.from("products").select("id").eq("handle", handle);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return handle;
    handle = `${desired}-${n}`;
    n += 1;
  }
}

export async function saveProductAction(formData) {
  await assertAdmin();

  const id = formData.get("id") || null;
  const title = String(formData.get("title") || "").trim();
  const requestedHandle = slugify(String(formData.get("handle") || title));
  const category = String(formData.get("category") || "");
  const description = String(formData.get("description") || "");
  const images = JSON.parse(formData.get("images") || "[]");
  const options = JSON.parse(formData.get("options") || "[]");
  const variants = JSON.parse(formData.get("variants") || "[]");
  const minQuantity = Math.max(1, Number(formData.get("minQuantity")) || 1);

  if (!title) throw new Error("Title is required");
  if (!variants.length) throw new Error("At least one variant is required");

  const handle = await uniqueHandle(requestedHandle, id);

  const productRow = { title, handle, category, description, images, options, min_quantity: minQuantity };

  let productId = id;
  if (id) {
    const { error } = await supabaseAdmin.from("products").update(productRow).eq("id", id);
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("product_variants").delete().eq("product_id", id);
  } else {
    const { data, error } = await supabaseAdmin.from("products").insert(productRow).select("id").single();
    if (error) throw new Error(error.message);
    productId = data.id;
  }

  const variantRows = variants.map((v) => ({
    product_id: productId,
    title: v.title,
    selected_options: v.selectedOptions || [],
    price: v.price,
    currency_code: v.currencyCode || "AED",
    stock: v.stock,
    image_url: v.imageUrl || null,
    sku: v.sku || null,
  }));

  const { error: variantError } = await supabaseAdmin.from("product_variants").insert(variantRows);
  if (variantError) throw new Error(variantError.message);

  revalidatePath("/admin/products");
  revalidatePath("/collections/all");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProductAction(formData) {
  await assertAdmin();
  const id = formData.get("id");
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  revalidatePath("/collections/all");
  revalidatePath("/");
}

export async function updateOrderStatusAction(formData) {
  await assertAdmin();
  const orderNo = formData.get("orderNo");
  let status = String(formData.get("status") || "");

  // Matches the old Apps Script behavior: a "Delivered" pick records when it
  // happened, since the status string itself is the only place that's shown.
  if (status === "Delivered") {
    const now = new Date();
    const formatted = now.toLocaleString("en-GB", {
      timeZone: "Asia/Dubai",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    status = `Delivered at ${formatted}`;
  }

  const { error } = await supabaseAdmin.from("orders").update({ status }).eq("order_no", orderNo);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/orders");
}

export async function deleteOrderAction(formData) {
  await assertAdmin();
  const orderNo = formData.get("orderNo");
  const { error } = await supabaseAdmin.from("orders").delete().eq("order_no", orderNo);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/orders");
}
