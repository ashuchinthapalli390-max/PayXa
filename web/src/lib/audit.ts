import "server-only";
import { randomBytes } from "node:crypto";
import { getSupabaseAdmin } from "./supabase";

/**
 * Writes website sign-ins to the shared Supabase audit_logs table (same DB as payxa-api).
 * Best effort: never blocks or fails a sign-in.
 */
export async function recordSignIn(u: { id: string; email: string | null; name: string | null; provider: string; isNewUser?: boolean }) {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("audit_logs").insert({
      public_id: `aud_${randomBytes(10).toString("hex")}`,
      merchant_id: null,
      user_id: null,
      action: u.isNewUser ? "website.account_created" : "website.sign_in",
      entity_type: "user",
      entity_id: u.id.slice(0, 128),
      changes: { email: u.email, name: u.name, provider: u.provider, source: "payxa.in" },
    });
    if (error) console.error("[payxa] audit insert failed:", error.message);
  } catch (e) {
    console.error("[payxa] audit unavailable:", e instanceof Error ? e.message : e);
  }
}
