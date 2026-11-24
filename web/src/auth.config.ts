/**
 * Auth.js configuration shared by src/auth.ts.
 * Providers: Google (when configured) + email one-time code (added in auth.ts, needs Node crypto).
 */
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { DASHBOARD_ORIGIN } from "@/lib/dashboard-url";

/** Auth.js needs a secret in production; without it we degrade gracefully instead of crashing. */
export const authConfigured = Boolean(process.env.AUTH_SECRET) || process.env.NODE_ENV !== "production";

export const googleEnabled = authConfigured && Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const providers: Provider[] = [];
if (googleEnabled)
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );

/**
 * Session cookie shared with dash.payxa.in.
 * Production: AUTH_COOKIE_DOMAIN=.payxa.in and the same AUTH_SECRET as the dashboard app.
 * Secure (and the __Secure- name) follows this site's own protocol, so localhost http still works.
 */
const secureCookies = process.env.NODE_ENV === "production";
const cookieDomain = secureCookies ? process.env.AUTH_COOKIE_DOMAIN || undefined : undefined;
// Browsers reject "__Secure-" cookies without the Secure flag, so plain-http dev always uses the plain name.
const cookieName = secureCookies ? process.env.AUTH_SESSION_COOKIE || "__Secure-authjs.session-token" : "authjs.session-token";

export const authConfig = {
  providers,
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login", error: "/login" },
  cookies: {
    sessionToken: {
      name: cookieName,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: secureCookies, domain: cookieDomain },
    },
  },
  callbacks: {
    /** Remember how the person signed in (shown in the dashboard's settings). */
    jwt({ token, account }) {
      if (account?.provider) token.provider = account.provider;
      return token;
    },
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
} satisfies NextAuthConfig;
