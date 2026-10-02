"use server";

// Pulls the site-wide announcement (e.g. delivery time) from the Supabase
// `settings` table (key = "announcement").

import { supabaseAdmin } from "./supabase-admin";

export async function getAnnouncement() {
  try {
    const { data, error } = await supabaseAdmin
      .from("settings")
      .select("value")
      .eq("key", "announcement")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data?.value || "").trim();
  } catch (err) {
    console.error("getAnnouncement failed:", err);
    return "";
  }
}
