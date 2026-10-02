import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Full-access client — bypasses RLS using the secret service-role key.
// The "server-only" import makes any accidental import of this file from a
// Client Component fail the build instead of leaking the key to the browser.
// Only use this from Server Actions / route handlers already behind the
// /admin password gate.
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});
