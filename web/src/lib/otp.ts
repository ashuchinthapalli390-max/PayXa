import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

/**
 * Stateless email one-time codes.
 *
 * The 6-digit code is emailed; the browser only holds a signed, httpOnly challenge
 * cookie containing a keyed hash of the code (never the code itself), the email,
 * expiry and attempt count. No database is needed and nothing can be forged without
 * AUTH_SECRET. After a correct code we mint a 60-second proof that the Auth.js
 * credentials provider accepts exactly once per sign-in.
 */

export const OTP_COOKIE = "pxa_otp";
export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000;
const PROOF_TTL_MS = 60 * 1000;

type Payload = {
  e: string; // email (lower-case)
  n: string; // display name supplied at sign-up (optional)
  h: string; // keyed hash of the code
  x: number; // expiry (ms)
  s: number; // sent at (ms)
  a: number; // failed attempts
  k: string; // nonce
};

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not configured");
  return s;
}

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const unb64 = (s: string) => Buffer.from(s, "base64url").toString("utf8");
const mac = (purpose: string, data: string) => createHmac("sha256", secret()).update(`${purpose}\n${data}`).digest("base64url");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const normalizeEmail = (v: unknown) => (typeof v === "string" ? v.trim().toLowerCase() : "");

export function isValidEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

const codeHash = (email: string, code: string, nonce: string) => mac("otp-code", `${email}|${code}|${nonce}`);

function seal(p: Payload) {
  const body = b64(JSON.stringify(p));
  return `${body}.${mac("otp-challenge", body)}`;
}

function open(token: string | undefined): Payload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sig, mac("otp-challenge", body))) return null;
  try {
    return JSON.parse(unb64(body)) as Payload;
  } catch {
    return null;
  }
}

/** New code + the sealed challenge to store in the cookie. */
export function createChallenge(email: string, name = "") {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const nonce = b64(String(randomInt(0, 2 ** 47)) + Date.now());
  const now = Date.now();
  const token = seal({ e: email, n: name.slice(0, 80), h: codeHash(email, code, nonce), x: now + OTP_TTL_MS, s: now, a: 0, k: nonce });
  return { code, token };
}

/** Seconds the person must wait before another code can be sent to this email. */
export function resendWaitSeconds(token: string | undefined, email: string) {
  const p = open(token);
  if (!p || p.e !== email) return 0;
  return Math.max(0, Math.ceil((p.s + OTP_RESEND_COOLDOWN_MS - Date.now()) / 1000));
}

export type VerifyResult =
  | { ok: true; email: string; name: string }
  | { ok: false; reason: "missing" | "mismatch" | "expired" | "locked" | "wrong"; next?: string; left?: number };

export function verifyChallenge(token: string | undefined, email: string, code: string): VerifyResult {
  const p = open(token);
  if (!p) return { ok: false, reason: "missing" };
  if (p.e !== email) return { ok: false, reason: "mismatch" };
  if (Date.now() > p.x) return { ok: false, reason: "expired" };
  if (p.a >= OTP_MAX_ATTEMPTS) return { ok: false, reason: "locked" };
  if (!/^\d{6}$/.test(code) || !safeEqual(codeHash(email, code, p.k), p.h)) {
    const a = p.a + 1;
    return { ok: false, reason: a >= OTP_MAX_ATTEMPTS ? "locked" : "wrong", next: seal({ ...p, a }), left: OTP_MAX_ATTEMPTS - a };
  }
  return { ok: true, email: p.e, name: p.n };
}

/** Short-lived proof handed to the Auth.js credentials provider after a correct code. */
export function createProof(email: string, name: string) {
  const body = b64(JSON.stringify({ e: email, n: name, x: Date.now() + PROOF_TTL_MS }));
  return `${body}.${mac("otp-proof", body)}`;
}

export function readProof(proof: unknown): { email: string; name: string } | null {
  if (typeof proof !== "string") return null;
  const [body, sig] = proof.split(".");
  if (!body || !sig || !safeEqual(sig, mac("otp-proof", body))) return null;
  try {
    const p = JSON.parse(unb64(body)) as { e: string; n: string; x: number };
    if (Date.now() > p.x || !isValidEmail(p.e)) return null;
    return { email: p.e, name: p.n };
  } catch {
    return null;
  }
}

/** Stable, non-reversible user id for an email (same person → same id across sign-ins). */
export const emailUserId = (email: string) => `email_${mac("user-id", email).slice(0, 24)}`;
