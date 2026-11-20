"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "motion/react";
import { getQr } from "@/lib/qr";

/** Crisp SVG QR from a real QR matrix, with the PayXa mark in the quiet centre. */
export function RealQR({ className = "", scanning = false }: { className?: string; scanning?: boolean }) {
  const { size, path } = useMemo(() => {
    const q = getQr();
    let d = "";
    for (let y = 0; y < q.size; y++) for (let x = 0; x < q.size; x++) if (q.on(x, y)) d += `M${x} ${y}h1v1h-1z`;
    return { size: q.size, path: d };
  }, []);
  return (
    <div className={`relative aspect-square overflow-hidden rounded-xl bg-white p-[6%] ${className}`}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" shapeRendering="crispEdges" aria-label="Checkout QR code" role="img">
        <path d={path} fill="#010101" />
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-[21%] place-items-center rounded-lg bg-ink p-[3%] ring-4 ring-white">
          <Image src="/brand/payxa-mark.png" alt="" width={57} height={30} className="w-full" />
        </span>
      </span>
      {scanning && <ScanBeam />}
    </div>
  );
}

/** Animated laser sweep used inside scanner viewfinders. */
export function ScanBeam({ duration = 2.2 }: { duration?: number }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 h-[18%]"
      initial={{ top: "-18%" }}
      animate={{ top: ["-18%", "100%"] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
    >
      <span className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-neon/35" />
      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-neon shadow-[0_0_16px_4px_rgba(255,66,101,0.8)]" />
    </motion.span>
  );
}

/** Phone-camera style viewfinder: dimmed surround, corner brackets, laser. */
export function ScannerFrame({
  children,
  locked = false,
  className = "",
}: {
  children: React.ReactNode;
  locked?: boolean;
  className?: string;
}) {
  const c = locked ? "border-ok" : "border-neon";
  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="pointer-events-none absolute -inset-[8%]">
        {[
          "top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-xl",
          "top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-xl",
          "bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-xl",
          "bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-xl",
        ].map((p) => (
          <motion.span
            key={p}
            className={`absolute size-[22%] ${p} ${c} transition-colors duration-300`}
            animate={locked ? { scale: 0.92 } : { scale: [1, 1.06, 1] }}
            transition={locked ? { duration: 0.3 } : { duration: 1.6, repeat: Infinity }}
          />
        ))}
      </div>
      {!locked && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <ScanBeam />
        </div>
      )}
    </div>
  );
}
