export default function HeroBottleWatermark() {
  return (
    <svg
      viewBox="0 0 220 260"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-auto -translate-x-1/2 -translate-y-1/2 text-[var(--color-gold)] opacity-[0.08] sm:h-[520px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="80" y="40" width="60" height="38" rx="4" />
      <rect x="92" y="26" width="36" height="16" rx="3" />
      <path d="M70 78 h80 l11 30 v130 a11 11 0 0 1 -11 11 h-80 a11 11 0 0 1 -11 -11 v-130 z" />
      <line x1="58" y1="170" x2="182" y2="170" />
    </svg>
  );
}
