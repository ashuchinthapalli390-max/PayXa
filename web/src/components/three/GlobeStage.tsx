/** Lightweight SVG orbit used as a decorative accent (and as the no-WebGL fallback look). */
export function OrbitFallback({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <radialGradient id="og" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d90429" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#d90429" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#d90429" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#og)" />
      <circle cx="200" cy="200" r="110" fill="none" stroke="#d90429" strokeOpacity="0.5" />
      {[...Array(7)].map((_, i) => (
        <ellipse key={i} cx="200" cy="200" rx="110" ry={110 - i * 16} fill="none" stroke="#ff4265" strokeOpacity="0.16" />
      ))}
      {[...Array(6)].map((_, i) => (
        <ellipse key={`v${i}`} cx="200" cy="200" rx={110 - i * 18} ry="110" fill="none" stroke="#ff4265" strokeOpacity="0.12" />
      ))}
      <ellipse cx="200" cy="200" rx="170" ry="60" fill="none" stroke="#d90429" strokeOpacity="0.6" transform="rotate(-22 200 200)" />
      <ellipse cx="200" cy="200" rx="185" ry="90" fill="none" stroke="#d90429" strokeOpacity="0.3" transform="rotate(35 200 200)" />
      <circle cx="355" cy="140" r="5" fill="#fff" />
      <circle cx="355" cy="140" r="14" fill="#ff4265" fillOpacity="0.25" />
      <circle cx="48" cy="262" r="4" fill="#fff" />
      <circle cx="48" cy="262" r="12" fill="#ff4265" fillOpacity="0.25" />
    </svg>
  );
}
