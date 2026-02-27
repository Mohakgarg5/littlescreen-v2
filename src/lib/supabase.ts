import { createClient } from "@supabase/supabase-js";

// Browser-safe client (uses anon key, respects RLS)
// Call this in client components
export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server-only admin client (uses service role key, bypasses RLS)
// NEVER import this in client components
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
