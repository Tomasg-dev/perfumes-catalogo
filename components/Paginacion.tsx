import Link from "next/link";

type PaginacionProps = {
  page: number;
  totalPages: number;
} & (
  | { hrefForPage: (page: number) => string; onPageChange?: never }
  | { onPageChange: (page: number) => void; hrefForPage?: never }
);

function getPageItems(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  const items: (number | "ellipsis")[] = [1];
  if (start > 2) items.push("ellipsis");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);
  return items;
}

export default function Paginacion({ page, totalPages, hrefForPage, onPageChange }: PaginacionProps) {
  if (totalPages <= 1) return null;

  const pageItems = getPageItems(page, totalPages);

  function PageLink({ p, active }: { p: number; active: boolean }) {
    const className = `flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm transition-colors ${
      active
        ? "border border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
        : "text-[var(--color-muted)] hover:text-[var(--color-gold)]"
    }`;
    if (hrefForPage) {
      return (
        <Link href={hrefForPage(p)} className={className} aria-current={active ? "page" : undefined}>
          {p}
        </Link>
      );
    }
    return (
      <button
        type="button"
        onClick={() => onPageChange?.(p)}
        className={className}
        aria-current={active ? "page" : undefined}
      >
        {p}
      </button>
    );
  }

  function NavLink({
    targetPage,
    disabled,
    children,
  }: {
    targetPage: number;
    disabled: boolean;
    children: React.ReactNode;
  }) {
    const className = disabled
      ? "text-[var(--color-border)]"
      : "text-[var(--color-ink)] hover:text-[var(--color-gold)]";
    if (disabled) return <span className={className}>{children}</span>;
    if (hrefForPage) {
      return (
        <Link href={hrefForPage(targetPage)} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <button type="button" onClick={() => onPageChange?.(targetPage)} className={className}>
        {children}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm">
      <NavLink targetPage={page - 1} disabled={page <= 1}>
        ← Anterior
      </NavLink>

      <div className="mx-2 flex items-center gap-1">
        {pageItems.map((item, i) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-[var(--color-muted)]">
              …
            </span>
          ) : (
            <PageLink key={item} p={item} active={item === page} />
          )
        )}
      </div>

      <NavLink targetPage={page + 1} disabled={page >= totalPages}>
        Siguiente →
      </NavLink>
    </div>
  );
}
