import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { DASHBOARD_ORIGIN, DASHBOARD_URL } from "@/lib/dashboard-url";

/** Auth.js needs a secret in production; without it we degrade gracefully instead of crashing. */
export const authConfigured = Boolean(process.env.AUTH_SECRET) || process.env.NODE_ENV !== "production";

export const googleEnabled = authConfigured && Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

/** Test merchant sign-in: development only, and only when explicitly enabled. */
export const testLoginEnabled = process.env.NODE_ENV !== "production" && process.env.AUTH_TEST_LOGIN === "true";

const providers: Provider[] = [];
if (googleEnabled)
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
if (testLoginEnabled)
  providers.push(
    Credentials({
      id: "test-merchant",
      name: "Test merchant",
      credentials: {},
      authorize: async () => ({ id: "test_merchant", name: "Test Merchant", email: "merchant@test.payxa", image: null }),
    }),
  );

/**
 * Session cookie shared with the dashboard subdomain (only when one is configured).
 * Set AUTH_COOKIE_DOMAIN=.payxa.com in production — the same value as the dashboard app.
 * Name + secure flag follow the dashboard's rule (https dashboard ⇒ __Secure- prefix), so both apps agree.
 */
const secureCookies = DASHBOARD_URL.startsWith("https://");
const sharedSessionCookie = DASHBOARD_URL
  ? {
      sessionToken: {
        name: process.env.AUTH_SESSION_COOKIE || (secureCookies ? "__Secure-authjs.session-token" : "authjs.session-token"),
        options: {
          httpOnly: true,
          sameSite: "lax" as const,
          path: "/",
          secure: secureCookies,
          domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
        },
      },
    }
  : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  cookies: sharedSessionCookie,
  callbacks: {
    /** Allow redirects back to the dashboard subdomain after login; everything else stays on this site. */
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const origin = new URL(url).origin;
        if (origin === baseUrl || origin === DASHBOARD_ORIGIN) return url;
      } catch {
        /* fall through */
      }
      return baseUrl;
    },
  },
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
