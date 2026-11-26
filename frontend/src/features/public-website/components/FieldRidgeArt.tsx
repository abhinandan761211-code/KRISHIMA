/**
 * Restrained decorative illustration for marketing sections.
 *
 * Deliberately CSS/SVG only — no illustration library, no heavy interactive
 * visualisation (task §5.6). Every shape uses the `--kr-illustration-*` tokens so
 * it themes automatically and never becomes a colour-only signal.
 *
 * Accessibility: the whole SVG is `aria-hidden` — it carries no information that
 * is not also in text.
 *
 * Hero variant is hidden from the small-screen layout to save bandwidth and
 * avoid crowding; the section copy carries the meaning on its own.
 */
export function FieldRidgeArt({ className, variant = "ridge" }: { className?: string; variant?: "ridge" | "rows" }) {
  const fill = "var(--kr-illustration-fill)";
  const stroke = "var(--kr-illustration-stroke)";
  const accent = "var(--kr-illustration-accent)";

  if (variant === "rows") {
    return (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 400 200"
        className={className}
        preserveAspectRatio="xMidYMax meet"
      >
        <g fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
          {Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={`M${-40 + i * 12} 200 Q ${120 + i * 22} ${120 - (i % 3) * 14} ${400 + i * 10} ${150 + (i % 4) * 12}`}
              opacity={0.35 + (i % 4) * 0.15}
            />
          ))}
        </g>
        <circle cx="330" cy="42" r="26" fill={accent} />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 400 240" className={className}>
      <path d="M0 150q80-40 160-10t240-30v130H0Z" fill={fill} />
      <path d="M0 185q110-30 210-4t190-18v77H0Z" fill={fill} opacity="0.75" />
      <g fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <path d="M60 60c0-16 12-28 28-28 0 16-12 28-28 28Z" />
        <path d="M88 60c0-16 12-28 28-28 0 16-12 28-28 28" />
        <path d="M88 60v34" />
      </g>
      <circle cx="330" cy="56" r="22" fill={accent} />
    </svg>
  );
}
