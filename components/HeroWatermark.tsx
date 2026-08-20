export default function HeroWatermark() {
  return (
    <>
      <svg
        viewBox="0 0 220 260"
        className="pointer-events-none absolute left-[2%] top-1/2 h-[300px] w-auto -translate-y-1/2 text-[var(--color-gold)] opacity-[0.08] sm:left-[8%] sm:h-[400px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <rect x="80" y="40" width="60" height="38" rx="4" />
        <rect x="92" y="26" width="36" height="16" rx="3" />
        <path d="M70 78 h80 l11 30 v130 a11 11 0 0 1 -11 11 h-80 a11 11 0 0 1 -11 -11 v-130 z" />
        <line x1="59" y1="170" x2="161" y2="170" />
      </svg>
      <svg
        viewBox="0 0 100 50"
        className="pointer-events-none absolute right-[0%] top-1/2 w-[260px] -translate-y-1/2 text-[var(--color-gold)] opacity-[0.08] sm:right-[6%] sm:w-[360px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 38 Q10 38 10 34 Q12 24 30 20 L68 12 Q78 10 84 16 L84 38 Z" />
        <rect x="6" y="38" width="84" height="7" rx="3.5" />
        <path d="M38 18 L42 24M48 16 L52 22M58 14 L62 20" />
      </svg>
    </>
  );
}
