import "server-only";

/**
 * Transactional email via Resend (https://resend.com/docs/api-reference/emails/send-email).
 *
 * RESEND_API_KEY   re_...            (required in production)
 * EMAIL_FROM       "PayXa <no-reply@payxa.in>"  (domain must be verified in Resend)
 * EMAIL_REPLY_TO   support@payxa.in  (optional)
 * CONTACT_INBOX    where contact-form messages are delivered
 */

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://payxa.in").replace(/\/+$/, "");
const FROM = process.env.EMAIL_FROM || "PayXa <no-reply@payxa.in>";

export const mailConfigured = () => Boolean(process.env.RESEND_API_KEY);

export type SendResult = { ok: true; id?: string } | { ok: false; reason: string };

export async function sendEmail(msg: { to: string | string[]; subject: string; html: string; text: string; replyTo?: string; tags?: { name: string; value: string }[] }): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, reason: "EMAIL_NOT_CONFIGURED" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(msg.to) ? msg.to : [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        reply_to: msg.replyTo ?? process.env.EMAIL_REPLY_TO ?? undefined,
        tags: msg.tags,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[payxa] Resend error", res.status, detail.slice(0, 300));
      return { ok: false, reason: `RESEND_${res.status}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (e) {
    console.error("[payxa] Resend unreachable", e);
    return { ok: false, reason: "RESEND_UNREACHABLE" };
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Bulletproof table layout, inline styles only, dark brand header, readable body. */
function layout(title: string, inner: string, preheader: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f4f2f3;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:#141216">
<span style="display:none!important;opacity:0;color:transparent;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2f3;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e7e2e4">
<tr><td style="background:#0b0a0d;padding:22px 28px;border-bottom:3px solid #d90429">
<img src="${SITE}/brand/payxa-wordmark.png" width="112" height="23" alt="PayXa" style="display:block;border:0;height:auto">
</td></tr>
<tr><td style="padding:32px 28px 8px">${inner}</td></tr>
<tr><td style="padding:20px 28px 28px;font-size:12px;line-height:18px;color:#8a8590;border-top:1px solid #f0ecee">
PayXa · UPI checkout and instant merchant alerts · <a href="${SITE}" style="color:#d90429;text-decoration:none">payxa.in</a><br>
Powered by CodeXa Agency
</td></tr>
</table></td></tr></table></body></html>`;
}

export function otpEmail(code: string, mode: "login" | "register") {
  const verb = mode === "register" ? "finish creating your PayXa account" : "sign in to PayXa";
  const inner = `
<h1 style="margin:0 0 12px;font-size:22px;line-height:30px;color:#0b0a0d">Your verification code</h1>
<p style="margin:0 0 24px;font-size:15px;line-height:23px;color:#3d3942">Use this code to ${verb}. It expires in 10 minutes.</p>
<div style="margin:0 0 24px;padding:18px 0;background:#faf6f7;border:1px solid #f1d6dc;border-radius:12px;text-align:center;font-family:'JetBrains Mono',Consolas,Menlo,monospace;font-size:34px;font-weight:700;letter-spacing:10px;color:#0b0a0d">${code}</div>
<p style="margin:0 0 8px;font-size:13px;line-height:20px;color:#6a6570">PayXa will never ask you for this code by phone, chat or email. If you didn't try to ${mode === "register" ? "sign up" : "sign in"}, you can ignore this message.</p>`;
  return {
    subject: `${code} is your PayXa verification code`,
    html: layout("Your PayXa verification code", inner, `Your PayXa code is ${code}. It expires in 10 minutes.`),
    text: `Your PayXa verification code is ${code}\n\nUse it to ${verb}. It expires in 10 minutes.\nIf you didn't request it, ignore this email.\n\n${SITE}`,
  };
}

export function contactEmail(m: { name: string; email: string; company: string; topic: string; message: string }) {
  const rows = [
    ["Name", m.name],
    ["Email", m.email],
    ["Company / website", m.company || "—"],
    ["Topic", m.topic],
  ]
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;font-size:13px;color:#8a8590;white-space:nowrap">${k}</td><td style="padding:6px 0;font-size:14px;color:#141216">${esc(v)}</td></tr>`)
    .join("");
  const inner = `
<h1 style="margin:0 0 16px;font-size:20px;color:#0b0a0d">New message from payxa.in</h1>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px">${rows}</table>
<div style="padding:16px;background:#faf6f7;border-radius:12px;font-size:14px;line-height:22px;color:#141216;white-space:pre-wrap">${esc(m.message)}</div>`;
  return {
    subject: `[${m.topic}] ${m.name} via payxa.in`,
    html: layout("New contact message", inner, `${m.name}: ${m.message.slice(0, 80)}`),
    text: `New message from payxa.in\n\nName: ${m.name}\nEmail: ${m.email}\nCompany: ${m.company || "-"}\nTopic: ${m.topic}\n\n${m.message}`,
  };
}

export function contactReceipt(name: string) {
  const inner = `
<h1 style="margin:0 0 12px;font-size:20px;color:#0b0a0d">Thanks, ${esc(name.split(" ")[0] || "there")}.</h1>
<p style="margin:0 0 12px;font-size:15px;line-height:23px;color:#3d3942">We've received your message and someone from the PayXa team will reply to this email address, usually within one business day.</p>`;
  return {
    subject: "We received your message · PayXa",
    html: layout("We received your message", inner, "Thanks for contacting PayXa."),
    text: `Thanks, we've received your message. The PayXa team will reply to this address, usually within one business day.\n\n${SITE}`,
  };
}
