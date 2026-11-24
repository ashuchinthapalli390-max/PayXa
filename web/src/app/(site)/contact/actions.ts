"use server";

import { headers } from "next/headers";
import { verifyTurnstile } from "@/lib/turnstile";
import { SUPPORT_INBOX, contactEmail, contactReceipt, mailConfigured, sendEmail } from "@/lib/mailer";
import { isValidEmail, normalizeEmail } from "@/lib/otp";

export type ContactState = { status: "idle" | "sent" | "error"; message?: string; captcha?: number };

const TOPICS = ["Sales & partnerships", "Support", "Security", "Other"];
const captchaRequired = () => Boolean(process.env.TURNSTILE_SECRET || process.env.TURNSTILE_SECRET_KEY) && Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
const clip = (v: FormDataEntryValue | null, n: number) => String(v ?? "").trim().slice(0, n);

export async function sendContact(prev: ContactState, fd: FormData): Promise<ContactState> {
  const bump = (prev.captcha ?? 0) + 1;
  // Honeypot: bots fill every field. Pretend success.
  if (clip(fd.get("website"), 200)) return { status: "sent", captcha: bump };

  const name = clip(fd.get("name"), 80);
  const email = normalizeEmail(fd.get("email"));
  const company = clip(fd.get("company"), 120);
  const topicRaw = clip(fd.get("topic"), 40);
  const topic = TOPICS.includes(topicRaw) ? topicRaw : "Other";
  const message = clip(fd.get("message"), 5000);

  if (name.length < 2) return { status: "error", message: "Please enter your name.", captcha: prev.captcha };
  if (!isValidEmail(email)) return { status: "error", message: "Please enter a valid email address.", captcha: prev.captcha };
  if (message.length < 10) return { status: "error", message: "Please tell us a little more (at least 10 characters).", captcha: prev.captcha };

  if (captchaRequired()) {
    const h = await headers();
    const ip = h.get("cf-connecting-ip") || h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const check = await verifyTurnstile(String(fd.get("cf-turnstile-response") ?? ""), ip, "contact");
    if (!check.ok) return { status: "error", message: "Security check didn't pass. Please complete it and try again.", captcha: bump };
  }

  const inbox = process.env.CONTACT_INBOX || SUPPORT_INBOX;
  const mail = contactEmail({ name, email, company, topic, message });
  const sent = await sendEmail({ to: inbox, subject: mail.subject, html: mail.html, text: mail.text, replyTo: email, tags: [{ name: "type", value: "contact" }] });

  if (!sent.ok) {
    if (process.env.NODE_ENV !== "production" && !mailConfigured()) {
      console.info(`[payxa] DEV ONLY - contact message from ${email} (${topic}) not emailed: RESEND_API_KEY is not set.`);
      return { status: "sent", captcha: bump };
    }
    return { status: "error", message: `We couldn't send your message right now. Please email ${inbox} directly.`, captcha: bump };
  }

  // Confirmation to the sender; failure here doesn't matter to them.
  const receipt = contactReceipt(name);
  await sendEmail({ to: email, subject: receipt.subject, html: receipt.html, text: receipt.text, tags: [{ name: "type", value: "contact-receipt" }] });
  return { status: "sent", captcha: bump };
}
