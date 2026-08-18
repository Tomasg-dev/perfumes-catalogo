export default function LoadingTenis() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <div className="mx-auto h-10 w-40 animate-pulse rounded bg-[var(--color-paper-alt)]" />
        <div className="mx-auto mt-3 h-4 w-32 animate-pulse rounded bg-[var(--color-paper-alt)]" />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-10 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-[3/4] w-full animate-pulse rounded bg-[var(--color-paper-alt)]" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--color-paper-alt)]" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--color-paper-alt)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
