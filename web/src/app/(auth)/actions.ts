"use server";

import { signIn, signOut, testLoginEnabled } from "@/auth";
import { resolveCallback } from "@/lib/dashboard-url";

export async function signInWithGoogle(formData: FormData) {
  await signIn("google", { redirectTo: resolveCallback(formData.get("callbackUrl")) });
}

export async function signInAsTestMerchant(formData: FormData) {
  if (!testLoginEnabled) throw new Error("Test sign-in is disabled");
  await signIn("test-merchant", { redirectTo: resolveCallback(formData.get("callbackUrl")) });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
