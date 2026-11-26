import { cn } from "../../lib/cn";

export type AvatarSize = "sm" | "md" | "lg";

const SIZES: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

/** Avatar with initials fallback. Decorative image: the name is conveyed separately. */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--kr-radius-full)]",
        "bg-[color:var(--kr-surface-muted)] font-semibold text-[color:var(--kr-primary-text)]",
        SIZES[size],
        className,
      )}
      title={name}
    >
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : initials(name)}
    </span>
  );
}
