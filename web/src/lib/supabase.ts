import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseClient) return supabaseClient;

  const url = process.env.SUPABASE_URL || "https://yxcrfisjywojwsdmjxib.supabase.co";
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!key) {
    throw new Error("SUPABASE_SECRET_KEY is required for admin identity queries.");
  }

  supabaseClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  return supabaseClient;
}
