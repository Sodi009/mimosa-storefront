"use server";

// Submits and fetches customer reviews from Supabase. Public (no admin
// check) by design — same as the old Apps Script's addReview/getReviews.

import { supabaseAdmin } from "./supabase-admin";

export async function submitReview({ name, rating, text }) {
  try {
    const { error } = await supabaseAdmin.from("reviews").insert({ name, rating, text });
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
