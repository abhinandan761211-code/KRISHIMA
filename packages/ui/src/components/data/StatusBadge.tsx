import { Badge, type BadgeTone } from "../display/Badge";

export type StatusKind =
  | "active"
  | "inactive"
  | "pending"
  | "verified"
  | "rejected"
  | "failed"
  | "connected"
  | "configured"
  | "not_configured"
  | "not_tested"
  | "tested"
  | "draft"
  | "completed"
  | "cancelled";

const MAP: Record<StatusKind, { label: string; tone: BadgeTone; glyph: string }> = {
  active: { label: "Active", tone: "success", glyph: "●" },
  inactive: { label: "Inactive", tone: "neutral", glyph: "○" },
  pending: { label: "Pending", tone: "warning", glyph: "◐" },
  verified: { label: "Verified", tone: "success", glyph: "✓" },
  rejected: { label: "Rejected", tone: "error", glyph: "✕" },
  failed: { label: "Failed", tone: "error", glyph: "✕" },
  connected: { label: "Connected", tone: "success", glyph: "✓" },
  configured: { label: "Configured", tone: "info", glyph: "⚙" },
  not_configured: { label: "Not configured", tone: "warning", glyph: "!" },
  not_tested: { label: "Not tested", tone: "neutral", glyph: "?" },
  tested: { label: "Tested", tone: "primary", glyph: "✓" },
  draft: { label: "Draft", tone: "neutral", glyph: "✎" },
  completed: { label: "Completed", tone: "success", glyph: "✓" },
  cancelled: { label: "Cancelled", tone: "neutral", glyph: "⊘" },
};

/**
 * Status pill. Always renders glyph + text — never colour alone (WCAG 1.4.1).
 * Pass `label` to override the default text (e.g. localized copy).
 */
export function StatusBadge({
  status,
  label,
  className,
}: {
  status: StatusKind;
  label?: string;
  className?: string;
}) {
  const s = MAP[status] ?? { label: status, tone: "neutral" as BadgeTone, glyph: "?" };
  return (
    <Badge tone={s.tone} icon={<span>{s.glyph}</span>} className={className}>
      {label ?? s.label}
    </Badge>
  );
}
