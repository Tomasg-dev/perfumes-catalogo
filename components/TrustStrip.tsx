const ITEMS = [
  {
    text: "Atención personalizada por WhatsApp",
    icon: (
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2Z" />
    ),
  },
  {
    text: "Alta fijación y larga duración",
    icon: (
      <>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    text: "Envíos a todo el país",
    icon: (
      <>
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="17.5" cy="18" r="1.5" />
      </>
    ),
  },
];

export default function TrustStrip() {
  return (
    <section className="border-b border-[var(--color-border)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-3">
        {ITEMS.map((item) => (
          <div key={item.text} className="flex flex-col items-center gap-3 text-center">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-[var(--color-gold)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              {item.icon}
            </svg>
            <p className="text-sm text-[var(--color-ink)]">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
