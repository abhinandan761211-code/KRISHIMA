import { cn } from "../../lib/cn";
import { Avatar } from "../display/Avatar";

export interface AccountOption {
  id: string;
  name: string;
  roleLabel: string;
  /** CSS var for the module accent, e.g. "var(--kr-mod-farmer)". */
  accentVar?: string;
}

/**
 * Workspace / account switcher (multi-role identity — ADR-0004).
 * Rendered as a native select for maximum reliability on low-cost devices.
 */
export function AccountSwitcher({
  accounts,
  activeId,
  onChange,
  className,
}: {
  accounts: AccountOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const active = accounts.find((a) => a.id === activeId) ?? accounts[0];
  if (!active) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar name={active.name} size="sm" />
      <label className="flex flex-col">
        <span className="sr-only">Active account</span>
        <select
          value={active.id}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "min-h-[36px] max-w-[220px] rounded-[var(--kr-radius-md)] border bg-[color:var(--kr-surface)] px-2 pr-7 text-sm font-medium",
            "border-[color:var(--kr-border-strong)] text-[color:var(--kr-fg-body)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)]",
          )}
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} · {a.roleLabel}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
