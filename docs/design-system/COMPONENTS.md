# KRISHIMA — Component Library

- **Version:** 1.0 (Phase 2)
- **Package:** [`packages/ui`](../../packages/ui) (`@krishima/ui`)
- **Live preview:** `/dev/design-system` (development builds only)

> **This is the only approved component set.** Do not re-implement a Button, Input, Card, etc. in
> a feature. If something is missing, extend `packages/ui` so every app benefits.

---

## 0. Import & setup

```tsx
// App entry (once)
import "@krishima/ui/styles/tokens.css";

// Anywhere
import { Button, Card, Input, PageHeader, StatusBadge } from "@krishima/ui";
```

Tailwind `content` must include `../packages/ui/src/**/*.{ts,tsx}` so component classes survive
purge.

---

## 1. Inventory

### Brand & theme
| Component | Props | Notes |
|-----------|-------|-------|
| `KrishimaLogo` | `size` sm/md/lg · `as` span/h1 · `variant` default/inverse · `decorative` | The **only** approved wordmark. KRISHI = brand green; MA = theme black/white. |
| `ThemeProvider` | `children` | Exactly **one** per app. |
| `ThemeSwitcher` | `className` | Light / Dark / System radiogroup. |

### Basics
| Component | Key props | Accessibility |
|-----------|-----------|---------------|
| `Button` | `variant` primary/secondary/ghost/danger/link · `size` sm/md/lg · `loading` · `leadingIcon` | `aria-busy` when loading; 44px min height |
| `IconButton` | **required** `aria-label` · `icon` · `variant` · `size` | Icon-only names enforced by the type system |
| `Input` | `label` · `hint` · `error` · `leadingIcon` · `readOnly` · `disabled` | `aria-invalid` + `aria-describedby`; error `role="alert"` |
| `Textarea` | `label` · `hint` · `error` | Same association pattern |
| `Select` | `label` · `options[]` · `placeholder` · `error` | Native `<select>` (best on low-cost devices) |
| `Checkbox` | `label` · `description` · `error` | 44px label hit area |
| `RadioGroup` | `label` · `name` · `value` · `onChange` · `options[]` | `<fieldset>/<legend>`, native arrow keys |
| `Switch` | `checked` · `onChange` · `label` · `description` | `role="switch"` + `aria-checked`; 44px target |
| `Label` | — | For controls not wrapped by the above |
| `Badge` | `tone` neutral/primary/success/error/warning/info · `icon` | Text always present |
| `Avatar` | `name` · `src` · `size` | Initials fallback; image is decorative |
| `Separator` | `orientation` · `label` | Decorative by default |

### Containers
| Component | Purpose |
|-----------|---------|
| `Card` / `CardHeader` / `CardTitle` / `CardBody` / `CardFooter` | Surface with tokenised padding & radius |
| `Container` | Centred responsive width (`sm…2xl`) with page padding |
| `Section` | Vertical section with heading + description |
| `PageHeader` | Page `<h1>`, description, actions slot, breadcrumb slot |
| `DashboardCard` | Tile with icon, module accent, footer link |
| `StatisticCard` | KPI with tabular numerals and delta (glyph + text) |

### Navigation
| Component | Purpose | Notes |
|-----------|---------|-------|
| `Navbar` | Top bar, sticky | Hidden links < `md` |
| `Sidebar` | Desktop dashboard nav | `aria-current="page"`, `md:` only |
| `MobileBottomNavigation` | Mobile tabs (max 5) | 56px targets, safe-area padding |
| `Breadcrumb` | Trail | Last item `aria-current="page"` |
| `Tabs` | WAI-ARIA tabs | Roving tabindex, Arrow/Home/End |
| `DropdownMenu` | Menu button + popup | Trigger content only (no nested interactive elements); Escape restores focus |
| `Pagination` | Bounded page window | `aria-current="page"`, labels on arrows |
| `AccountSwitcher` | Workspace/role switcher | Native select for reliability |

### Feedback
| Component | Purpose |
|-----------|---------|
| `Alert` | Inline message with tone (icon + text label) |
| `ToastProvider` / `useToast` | Single live region; `role="alert"` for errors |
| `Dialog` | Modal on native `<dialog>` (focus trap, Escape) |
| `Drawer` | Side/bottom sheet on `<dialog>` |
| `Tooltip` | Hover **and** focus; `aria-describedby` |
| `Skeleton` / `SkeletonText` | Loading placeholders (`aria-hidden`, reduced-motion safe) |
| `Spinner` | `role="status"`; `decorative` when a live region exists |
| `ProgressBar` | Native `progressbar` semantics |
| `EmptyState` / `ErrorState` / `OfflineState` | The three mandatory non-happy states |

### Data display
| Component | Purpose |
|-----------|---------|
| `DataTable` | Real table + `<caption>`; secondary columns hide responsively |
| `StatusBadge` | Status vocabulary with glyph + label (never colour-only) |
| `Timeline` | Ordered activity log |
| `ListItem` | Row with leading/trailing slots |
| `ChartContainer` | Title + required text `summary` alternative + fixed height |

### Typography
`Heading`, `Text`, `NumericText` — see [TYPOGRAPHY.md](TYPOGRAPHY.md).

---

## 2. Status vocabulary

`StatusBadge` maps a fixed set of statuses to tone + glyph + label:

`active · inactive · pending · verified · rejected · failed · connected · configured ·
not_configured · not_tested · tested · draft · completed · cancelled`

Each renders a **glyph and a text label**, so the meaning survives colour-blindness, greyscale and
screen readers.

---

## 3. Interaction states

Every interactive component implements: **default · hover · active · focus-visible · disabled**,
and where relevant **selected · loading · read-only · error · success · warning**.

- Focus is always visible (`2px` ring, token `--kr-focus-ring`) and never removed.
- Hover/active change **both** fill and text contrast deliberately (validated).
- Disabled uses `--kr-disabled-bg/-fg` (contrast-checked at 4.5:1).
- Loading sets `aria-busy` and keeps layout stable.

---

## 4. Adding a component

1. Put it in `packages/ui/src/components/<group>/`.
2. Use only semantic/component tokens — no raw hex, no `<div onClick>`.
3. Support keyboard operation and visible focus.
4. Add the export to `packages/ui/src/index.ts`.
5. Add it to `/dev/design-system` and a unit test.
6. Document it in this file.
