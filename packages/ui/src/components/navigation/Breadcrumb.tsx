export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Breadcrumb trail. The last item is the current page (aria-current="page"). */
export function Breadcrumb({ items, label = "Breadcrumb" }: { items: BreadcrumbItem[]; label?: string }) {
  return (
    <nav aria-label={label} className="mb-2">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[color:var(--kr-fg-muted)]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <a
                  href={item.href}
                  className="rounded-[var(--kr-radius-sm)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)]"
                >
                  {item.label}
                </a>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-medium text-[color:var(--kr-fg-body)]" : ""}>
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-[color:var(--kr-fg-placeholder)]">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
