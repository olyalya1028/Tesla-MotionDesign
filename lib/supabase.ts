import { createClient } from "@supabase/supabase-js";

// The project the site ships against. These are safe to commit: a publishable
// key is meant to be public — in a normal Supabase app it is baked into the
// browser bundle — and the real boundary is row level security, which only lets
// this key INSERT into public.contact_submissions. Env vars still win, so a
// fork or a staging deploy can point somewhere else without touching code.
const DEFAULT_SUPABASE_URL = "https://kjadyhxrogpovpjpbcea.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_SIrM1Wrp7xBXihJZfL2vtQ_vYULQIH-";

/**
 * Server-side Supabase client, created per request so a bad configuration
 * fails one request instead of the build.
 */
export function createSupabaseClient() {
  const url = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

  return createClient(url, key, { auth: { persistSession: false } });
}
