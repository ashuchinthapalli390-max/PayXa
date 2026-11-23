import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig, authConfigured } from "./auth.config";
import { emailUserId, readProof } from "@/lib/otp";

export { authConfigured, googleEnabled } from "./auth.config";

/**
 * Email one-time-code sign-in. The code itself is checked in the server action
 * (src/app/(auth)/email-actions.ts); this provider only accepts the short-lived,
 * signed proof that action mints after a correct code.
 */
const EmailOtp = Credentials({
  id: "email-otp",
  name: "Email code",
  credentials: { proof: {} },
  authorize: async (credentials) => {
    const p = readProof(credentials?.proof);
    if (!p) return null;
    const fallbackName = p.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { id: emailUserId(p.email), email: p.email, name: p.name || fallbackName, image: null };
  },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [...authConfig.providers, EmailOtp],
  events: {
    /** Every successful login is recorded in the shared audit log. Never blocks sign-in. */
    async signIn({ user, account, isNewUser }) {
      const { recordSignIn } = await import("@/lib/audit");
      await recordSignIn({
        id: user.id ?? account?.providerAccountId ?? "",
        email: user.email ?? null,
        name: user.name ?? null,
        provider: account?.provider ?? "unknown",
        isNewUser,
      });
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
