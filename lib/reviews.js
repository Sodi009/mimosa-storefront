"use server";

// Submits and fetches customer reviews from Supabase. Public (no admin
// check) by design — same as the old Apps Script's addReview/getReviews.
// Reviews are general (homepage) by default, or tied to a specific
// product via product_id when submitted from that product's page.

import { supabaseAdmin } from "./supabase-admin";

const REVIEW_BUCKET = "review-images";

export async function submitReview({ name, rating, text, productId, photoUrl }) {
  try {
    const { error } = await supabaseAdmin.from("reviews").insert({
      name,
      rating,
      text,
      product_id: productId || null,
      photo_url: photoUrl || null,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  } catch (err) {
    console.error("submitReview failed:", err);
    return { success: false, error: err.message };
  }
}

export async function getReviews() {
  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("name, rating, text, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  } catch (err) {
    console.error("getReviews failed:", err);
    return [];
  }
}

export async function getProductReviews(productId) {
  if (!productId) return [];
  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("name, rating, text, photo_url, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  } catch (err) {
    console.error("getProductReviews failed:", err);
    return [];
  }
}

// Signed upload URL for a review photo — public, same reasoning as the
// rest of this file: customers leaving a review aren't logged in.
export async function getReviewUploadUrl(fileName) {
  const ext = fileName.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage.from(REVIEW_BUCKET).createSignedUploadUrl(path);
  if (error) throw new Error(error.message);

  const { data: pub } = supabaseAdmin.storage.from(REVIEW_BUCKET).getPublicUrl(path);
  return { path, token: data.token, publicUrl: pub.publicUrl };
}
