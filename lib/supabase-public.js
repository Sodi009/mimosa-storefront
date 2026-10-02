import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Public, read-only client — safe to import from Client Components, the
// browser bundle, or the server. Only has access to what RLS policies allow
// (product/variant reads), never the service-role key.
export const supabasePublic = createClient(url, anonKey, {
  auth: { persistSession: false },
});
