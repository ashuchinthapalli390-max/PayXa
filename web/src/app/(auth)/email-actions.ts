"use server";

import { cookies, headers } from "next/headers";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { resolveCallback } from "@/lib/dashboard-url";
import { verifyTurnstile } from "@/lib/turnstile";
import { mailConfigured, otpEmail, sendEmail } from "@/lib/mailer";
import {
  OTP_COOKIE,
  OTP_TTL_MS,
  createChallenge,
  createProof,
  isValidEmail,
  normalizeEmail,
  resendWaitSeconds,
  verifyChallenge,
} from "@/lib/otp";

export type EmailAuthState = {
  step: "email" | "code";
  email: string;
  name: string;
  error?: string;
  info?: string;
  /** seconds before "Resend code" becomes available */
  wait?: number;
  /** bumps whenever the security check must be redone */
  captcha?: number;
};

const isProd = process.env.NODE_ENV === "production";
const captchaRequired = () => Boolean(process.env.TURNSTILE_SECRET || process.env.TURNSTILE_SECRET_KEY) && Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

async function setChallengeCookie(token: string) {
  (await cookies()).set(OTP_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(OTP_TTL_MS / 1000),
  });
}

async function clientIp() {
  const h = await headers();
  return h.get("cf-connecting-ip") || h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

/** Single entry point for the form: "send" (or resend) a code, or "verify" one. */
export async function emailAuth(prev: EmailAuthState, fd: FormData): Promise<EmailAuthState> {
  return fd.get("intent") === "verify" ? verifyEmailCode(prev, fd) : requestEmailCode(prev, fd);
}

/** Step 1: validate, run the security check, email a fresh 6-digit code. */
export async function requestEmailCode(prev: EmailAuthState, fd: FormData): Promise<EmailAuthState> {
  const mode = fd.get("mode") === "register" ? "register" : "login";
  const email = normalizeEmail(fd.get("email"));
  const name = String(fd.get("name") ?? "").trim().replace(/\s+/g, " ");
  const base: EmailAuthState = { step: "email", email, name, captcha: prev.captcha };

  if (!isValidEmail(email)) return { ...base, error: "Enter a valid email address." };
  if (mode === "register" && (name.length < 2 || name.length > 80)) return { ...base, error: "Enter your full name." };

  if (captchaRequired()) {
    const check = await verifyTurnstile(String(fd.get("cf-turnstile-response") ?? ""), await clientIp(), mode === "register" ? "merchant-register" : "merchant-login");
    if (!check.ok) return { ...base, step: prev.step, error: "Security check didn't pass. Please complete it and try again.", captcha: (prev.captcha ?? 0) + 1 };
  }

  const jar = await cookies();
  const wait = resendWaitSeconds(jar.get(OTP_COOKIE)?.value, email);
  if (wait > 0) return { ...base, step: "code", wait, info: `A code was just sent. You can request another in ${wait}s.`, captcha: (prev.captcha ?? 0) + 1 };

  const { code, token } = createChallenge(email, mode === "register" ? name : "");
  const mail = otpEmail(code, mode);
  const sent = await sendEmail({ to: email, subject: mail.subject, html: mail.html, text: mail.text, tags: [{ name: "type", value: "otp" }] });

  if (!sent.ok) {
    if (!isProd && !mailConfigured()) {
      // Local development without RESEND_API_KEY: show the code in the server log only.
      console.info(`[payxa] DEV ONLY - verification code for ${email}: ${code}`);
    } else {
      return { ...base, error: "We couldn't send the email right now. Please try again in a minute.", captcha: (prev.captcha ?? 0) + 1 };
    }
  }

  await setChallengeCookie(token);
  return { step: "code", email, name, wait: 30, info: `We sent a 6-digit code to ${email}.`, captcha: (prev.captcha ?? 0) + 1 };
}

const reasonText: Record<string, string> = {
  missing: "That code has expired. Request a new one.",
  mismatch: "That code was sent to a different email. Request a new one.",
  expired: "That code has expired. Request a new one.",
  locked: "Too many wrong attempts. Request a new code.",
};

/** Step 2: check the code, then sign in with a one-minute proof. */
export async function verifyEmailCode(prev: EmailAuthState, fd: FormData): Promise<EmailAuthState> {
  const email = normalizeEmail(fd.get("email"));
  const code = String(fd.get("code") ?? "").replace(/\D/g, "");
  const jar = await cookies();
  const result = verifyChallenge(jar.get(OTP_COOKIE)?.value, email, code);

  if (!result.ok) {
    if (result.next) await setChallengeCookie(result.next);
    if (result.reason === "wrong")
      return { ...prev, step: "code", email, wait: undefined, info: undefined, error: `That code isn't right. ${result.left} attempt${result.left === 1 ? "" : "s"} left.` };
    jar.delete(OTP_COOKIE);
    return { ...prev, step: "email", email, wait: 0, error: reasonText[result.reason] };
  }

  jar.delete(OTP_COOKIE);
  const proof = createProof(result.email, result.name || prev.name);
  try {
    await signIn("email-otp", { proof, redirectTo: resolveCallback(fd.get("callbackUrl")) });
  } catch (e) {
    if (e instanceof AuthError) return { ...prev, step: "email", email, error: "Sign-in failed. Please request a new code." };
    throw e; // the success redirect
  }
  return prev;
}
