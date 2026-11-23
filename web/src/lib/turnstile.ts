import "server-only";

const isProd = process.env.NODE_ENV === "production";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET || process.env.TURNSTILE_SECRET_KEY || "";
const CONFIGURED_HOSTNAMES = (process.env.TURNSTILE_HOSTNAMES || "payxa.in,api.payxa.in,dashboard.payxa.in")
  .split(",")
  .map(h => h.trim().toLowerCase())
  .filter(Boolean);

// Test keys support for local development if real keys not set
const CF_TEST_SECRET = "1x0000000000000000000000000000000AA";
const effectiveSecret = TURNSTILE_SECRET || (!isProd ? CF_TEST_SECRET : "");

export type TurnstileResult = { ok: true; hostname?: string; action?: string } | { ok: false; reason: string };

type SiteverifyResponse = {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
};

/**
 * Server-side validation of a Cloudflare Turnstile challenge token.
 * Tokens are single-use and expire after 5 minutes.
 */
export async function verifyTurnstile(
  token: string,
  remoteip?: string | null,
  expectedAction?: string
): Promise<TurnstileResult> {
  if (!effectiveSecret) {
    return { ok: false, reason: "TURNSTILE_NOT_CONFIGURED" };
  }

  if (!token || typeof token !== "string" || token.length < 10 || token.length > 4096) {
    return { ok: false, reason: "INVALID_TOKEN_FORMAT" };
  }

  const body = new URLSearchParams({
    secret: effectiveSecret,
    response: token,
    idempotency_key: crypto.randomUUID()
  });

  if (remoteip) {
    body.set("remoteip", remoteip);
  }

  let data: SiteverifyResponse;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      cache: "no-store",
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) {
      return { ok: false, reason: `SITEVERIFY_HTTP_${res.status}` };
    }

    data = (await res.json()) as SiteverifyResponse;
  } catch (err: any) {
    return { ok: false, reason: err.name === "TimeoutError" ? "TURNSTILE_TIMEOUT" : "CLOUDFLARE_UNREACHABLE" };
  }

  if (!data.success) {
    return { ok: false, reason: data["error-codes"]?.[0] ?? "CHALLENGE_FAILED" };
  }

  // Validate expected action if specified
  if (expectedAction && data.action && data.action !== expectedAction) {
    return { ok: false, reason: "ACTION_MISMATCH" };
  }

  // Validate allowed hostnames
  const allowed = new Set([
    ...CONFIGURED_HOSTNAMES,
    ...(!isProd ? ["localhost", "127.0.0.1"] : [])
  ]);

  if (data.hostname) {
    const host = data.hostname.toLowerCase().trim();
    const isAllowed = allowed.has(host) || Array.from(allowed).some(a => host.endsWith("." + a));
    if (!isAllowed) {
      return { ok: false, reason: "HOSTNAME_MISMATCH" };
    }
  }

  return { ok: true, hostname: data.hostname, action: data.action };
}
