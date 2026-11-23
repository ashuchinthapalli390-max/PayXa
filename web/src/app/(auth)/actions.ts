"use server";

import { signIn, signOut } from "@/auth";
import { resolveCallback } from "@/lib/dashboard-url";

export async function signInWithGoogle(formData: FormData) {
  await signIn("google", { redirectTo: resolveCallback(formData.get("callbackUrl")) });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
