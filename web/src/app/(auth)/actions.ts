"use server";

import { signIn, signOut, testLoginEnabled } from "@/auth";

/** Only allow same-site relative redirects after sign-in. */
function safeCallback(v: FormDataEntryValue | null) {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/dashboard";
}

export async function signInWithGoogle(formData: FormData) {
  await signIn("google", { redirectTo: safeCallback(formData.get("callbackUrl")) });
}

export async function signInAsTestMerchant(formData: FormData) {
  if (!testLoginEnabled) throw new Error("Test sign-in is disabled");
  await signIn("test-merchant", { redirectTo: safeCallback(formData.get("callbackUrl")) });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
