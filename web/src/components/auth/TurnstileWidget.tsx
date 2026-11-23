"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, TriangleAlert, RotateCcw } from "lucide-react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript() {
  if (typeof window !== "undefined" && window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      s.remove();
      reject(new Error("Failed to load Cloudflare Turnstile script"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

interface TurnstileWidgetProps {
  siteKey: string;
  action?: string;
  /** Optional: server components can't pass functions to client components. */
  onSuccess?: (token: string) => void;
  onError?: (err?: string) => void;
}

export default function TurnstileWidget({
  siteKey,
  action = "admin-sso",
  onSuccess,
  onError
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!siteKey) {
      setError("Turnstile site key is missing.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: "dark",
          size: "flexible",
          callback: (token: string) => {
            setError(null);
            onSuccess?.(token);
          },
          "error-callback": () => {
            const msg = "Cloudflare security check failed. Please retry.";
            setError(msg);
            onError?.(msg);
          },
          "expired-callback": () => {
            if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
          },
          "timeout-callback": () => {
            const msg = "Security check timed out. Please retry.";
            setError(msg);
            onError?.(msg);
          }
        });
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        const msg = "Could not load Cloudflare Turnstile. Please check network/ad-blockers.";
        setError(msg);
        setLoading(false);
        onError?.(msg);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, action, onSuccess, onError, attempt]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setAttempt(a => a + 1);
  };

  return (
    <div className="w-full my-4">
      <div ref={containerRef} className="min-h-[65px] w-full overflow-hidden rounded-xl" />
      {loading && (
        <div className="flex h-[65px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] text-[13px] text-muted">
          <Loader2 size={16} className="animate-spin text-neon" />
          <span>Verifying security environment...</span>
        </div>
      )}
      {error && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-crimson/30 bg-crimson/10 p-3 text-[13px] text-paper">
          <div className="flex items-center gap-2">
            <TriangleAlert size={16} className="text-neon shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-1 rounded px-2 py-1 text-[12px] text-neon hover:bg-crimson/20"
          >
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      )}
    </div>
  );
}
