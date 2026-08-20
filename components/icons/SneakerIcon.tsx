export default function SneakerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 50"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 38 Q10 38 10 34 Q12 24 30 20 L68 12 Q78 10 84 16 L84 38 Z" />
      <rect x="6" y="38" width="84" height="7" rx="3.5" />
      <path d="M38 18 L42 24M48 16 L52 22M58 14 L62 20" />
    </svg>
  );
}
