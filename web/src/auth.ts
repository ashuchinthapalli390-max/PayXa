import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";

/** Auth.js needs a secret in production; without it we degrade gracefully instead of crashing. */
export const authConfigured = Boolean(process.env.AUTH_SECRET) || process.env.NODE_ENV !== "production";

export const googleEnabled = authConfigured && Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

/** Test merchant sign-in: development only, and only when explicitly enabled. */
export const testLoginEnabled = process.env.NODE_ENV !== "production" && process.env.AUTH_TEST_LOGIN === "true";

const providers: Provider[] = [];
if (googleEnabled) providers.push(Google);
if (testLoginEnabled)
  providers.push(
    Credentials({
      id: "test-merchant",
      name: "Test merchant",
      credentials: {},
      authorize: async () => ({ id: "test_merchant", name: "Test Merchant", email: "merchant@test.payxa", image: null }),
    }),
  );

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
});

/** Session lookup that never throws (missing secret, bad cookie, etc. → signed out). */
export async function getSession() {
  if (!authConfigured) return null;
  try {
    return await auth();
  } catch {
    return null;
  }
}
