export default function BottleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="48" y="10" width="24" height="16" rx="2" />
      <rect x="52" y="6" width="16" height="6" rx="1" />
      <path d="M42 26 h36 l6 14 v96 a6 6 0 0 1 -6 6 h-36 a6 6 0 0 1 -6 -6 v-96 z" />
      <line x1="36" y1="70" x2="84" y2="70" />
    </svg>
  );
}
