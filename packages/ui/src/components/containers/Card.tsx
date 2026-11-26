import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  /** Elevated cards get a subtle shadow; flat cards rely on the border. */
  elevation?: "flat" | "raised";
}

const PADDING = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

export function Card({ className, padding = "md", elevation = "flat", children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)]",
        "bg-[color:var(--kr-surface)]",
        elevation === "raised" && "shadow-[var(--kr-shadow-sm)]",
        PADDING[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mb-3 flex items-start justify-between gap-3", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]", className)}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("text-[15px] text-[color:var(--kr-fg-body)]", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-4 flex items-center gap-2", className)}>{children}</div>;
}
