import type { LabelHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/** Standalone label for controls that are not wrapped by Input/Select/Textarea. */
export function Label({ className, children, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium text-[color:var(--kr-fg-body)]", className)}
      {...rest}
    >
      {children}
    </label>
  );
}
