"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string; hint?: string; disabled?: boolean };

type Props = {
  options: (SelectOption | string)[];
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Form field name: a hidden input carries the value on submit. */
  name?: string;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
};

const norm = (o: SelectOption | string): SelectOption => (typeof o === "string" ? { value: o, label: o } : o);

/**
 * PayXa dropdown. Replaces the native <select> (whose open list can't be themed and renders
 * as the OS's white/blue menu). Keyboard: Enter/Space/Arrows open; Arrows/Home/End move;
 * typing jumps by first letter; Enter selects; Esc/Tab close.
 */
export default function Select({
  options: raw,
  value,
  defaultValue,
  onValueChange,
  name,
  id,
  placeholder = "Select…",
  disabled,
  required,
  size = "md",
  className = "",
  "aria-label": ariaLabel,
}: Props) {
  const options = useMemo(() => raw.map(norm), [raw]);
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = value ?? inner;
  const selected = options.find((o) => o.value === current);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [pos, setPos] = useState<{ left: number; top: number; width: number; up: boolean } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: "", at: 0 });
  const uid = useId();
  const listId = `${uid}-list`;

  const place = useCallback(() => {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const want = Math.min(280, options.length * 40 + 12);
    const below = window.innerHeight - r.bottom;
    const up = below < want + 12 && r.top > below;
    setPos({ left: r.left, top: up ? r.top - 6 : r.bottom + 6, width: r.width, up });
  }, [options.length]);

  const openList = (at?: number) => {
    if (disabled) return;
    place();
    const idx = options.findIndex((o) => o.value === current);
    setActive(at ?? (idx >= 0 ? idx : options.findIndex((o) => !o.disabled)));
    setOpen(true);
  };

  const choose = (o: SelectOption) => {
    if (o.disabled) return;
    if (value === undefined) setInner(o.value);
    onValueChange?.(o.value);
    setOpen(false);
    btn.current?.focus();
  };

  // Close on outside click. While open, follow the trigger every frame: smooth scrolling,
  // reveal animations and layout shifts move it without firing scroll events.
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!btn.current?.contains(t) && !list.current?.contains(t)) setOpen(false);
    };
    let raf = 0;
    let last = "";
    const follow = () => {
      const r = btn.current?.getBoundingClientRect();
      if (r) {
        const key = `${Math.round(r.left)}|${Math.round(r.top)}|${Math.round(r.width)}|${window.innerHeight}`;
        if (key !== last) {
          last = key;
          place();
        }
      }
      raf = requestAnimationFrame(follow);
    };
    raf = requestAnimationFrame(follow);
    window.addEventListener("pointerdown", down);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", down);
    };
  }, [open, place]);

  // Keep the highlighted option in view.
  useLayoutEffect(() => {
    if (open && active >= 0) list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const step = (from: number, dir: 1 | -1) => {
    for (let i = 1; i <= options.length; i++) {
      const n = (from + dir * i + options.length) % options.length;
      if (!options[n].disabled) return n;
    }
    return from;
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => step(a, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => step(a, -1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(step(-1, 1));
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(step(options.length, -1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (options[active]) choose(options[active]);
    } else if (e.key.length === 1) {
      const now = Date.now();
      typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : "") + e.key.toLowerCase(), at: now };
      const hit = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(typed.current.text));
      if (hit >= 0) setActive(hit);
    }
  };

  const h = size === "sm" ? "h-9 text-[13px] px-3" : "h-11 text-[14px] px-3.5";

  return (
    <>
      {name && <input type="hidden" name={name} value={current} required={required} />}
      <button
        ref={btn}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
        className={`group flex w-full items-center justify-between gap-2 rounded-xl border bg-ink text-left text-paper outline-none transition-[border-color,box-shadow,background-color] ${h} ${
          open ? "border-neon shadow-[0_0_0_3px_rgba(255,66,101,0.15)]" : "border-white/10 hover:border-white/20"
        } focus-visible:border-neon focus-visible:shadow-[0_0_0_3px_rgba(255,66,101,0.15)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <span className={`truncate ${selected ? "" : "text-dim"}`}>{selected?.label ?? placeholder}</span>
        <ChevronDown size={15} className={`shrink-0 text-dim transition-transform duration-200 group-hover:text-muted ${open ? "rotate-180 text-neon" : ""}`} />
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={list}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-label={ariaLabel}
            style={{ position: "fixed", left: pos.left, top: pos.top, minWidth: pos.width, transform: pos.up ? "translateY(-100%)" : undefined }}
            className="pxa-pop z-[90] max-h-[280px] overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-[#141217]/95 p-1.5 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,66,101,0.06)] backdrop-blur-xl"
            onMouseDown={(e) => e.preventDefault()}
          >
            {options.map((o, i) => {
              const isSel = o.value === current;
              const isAct = i === active;
              return (
                <li
                  key={o.value}
                  id={`${listId}-${i}`}
                  data-i={i}
                  role="option"
                  aria-selected={isSel}
                  aria-disabled={o.disabled}
                  onMouseEnter={() => !o.disabled && setActive(i)}
                  onClick={() => choose(o)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${
                    o.disabled ? "cursor-not-allowed opacity-40" : isAct ? "bg-white/[0.06] text-paper" : "text-muted"
                  } ${isSel ? "text-paper" : ""}`}
                >
                  <span className={`grid size-4 shrink-0 place-items-center ${isSel ? "text-neon" : "text-transparent"}`}>
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{o.label}</span>
                    {o.hint && <span className="block truncate text-[11.5px] text-dim">{o.hint}</span>}
                  </span>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </>
  );
}
