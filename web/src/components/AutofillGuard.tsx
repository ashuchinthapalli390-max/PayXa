"use client";

import { useEffect } from "react";

/** Browser features that genuinely help and are left on. */
const KEEP = new Set(["one-time-code", "current-password", "new-password"]);
const SKIP_TYPES = new Set(["hidden", "checkbox", "radio", "range", "color", "file", "submit", "button", "reset", "image"]);
/**
 * Chrome ignores autocomplete="off" for address/contact autofill but does not offer saved entries
 * for a field whose autocomplete token it doesn't recognise. "off" stays on forms for the
 * per-field history dropdown.
 */
const TOKEN = "payxa-no-autofill";

function guard(root: ParentNode) {
  root.querySelectorAll?.("form").forEach((f) => {
    if (!f.closest("[data-autofill='allow']")) f.setAttribute("autocomplete", "off");
  });
  root.querySelectorAll?.<HTMLInputElement | HTMLTextAreaElement>("input, textarea").forEach((el) => {
    if (el instanceof HTMLInputElement && SKIP_TYPES.has(el.type)) return;
    if (el.closest("[data-autofill='allow']")) return;
    const current = (el.getAttribute("autocomplete") ?? "").toLowerCase();
    if (KEEP.has(current) || current === TOKEN) return;
    el.setAttribute("autocomplete", TOKEN);
  });
}

/**
 * Stops the browser's saved-address / past-entry suggestion popups from covering PayXa fields,
 * including fields that appear later (dialogs, wizard steps). Opt a section back in with
 * data-autofill="allow". OTP and password fields are untouched.
 */
export default function AutofillGuard() {
  useEffect(() => {
    guard(document);
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("input, textarea, form")) guard(n.parentElement ?? document);
          else guard(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  return null;
}
