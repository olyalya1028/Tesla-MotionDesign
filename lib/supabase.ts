import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Uses the publishable (anon) key, so every write
 * still goes through row level security — public.contact_submissions only has
 * an INSERT policy, which is exactly what the contact form needs.
 *
 * Created per request instead of at module scope so a missing env var fails
 * inside the route handler (a 500 for one request) rather than at build time.
 */
export function createSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY — see .env.example",
    );
  }

  return createClient(url, key, { auth: { persistSession: false } });
}
