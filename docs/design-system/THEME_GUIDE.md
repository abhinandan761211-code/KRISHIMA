# KRISHIMA — Theme Guide

- **Version:** 1.0 (Phase 2)
- **Runtime:** [`packages/ui/src/theme/`](../../packages/ui/src/theme)
- **Selector:** `data-theme` on `<html>`

---

## 1. Preferences

| Preference | Behaviour |
|------------|-----------|
| **Light** | Always light. **Default when nothing is stored.** |
| **Dark** | Always dark. |
| **System** | Follows the OS and **reacts live** to OS changes. |

The choice is persisted in `localStorage` under the key **`krishima.theme`** and survives reloads.
If storage is unavailable (private mode, disabled), the app falls back to **light** without error.

---

## 2. How it works

```
index.html (inline <script>, runs before first paint)
        │  reads localStorage → resolves → sets <html data-theme> + color-scheme
        ▼
ThemeProvider (React)
        │  state: preference + systemDark
        │  effects: applyTheme(resolved), matchMedia('change') listener
        ▼
tokens.css  [data-theme="dark"] { --kr-* overrides }
        ▼
Tailwind utilities (var(--kr-*)) → components
```

- The **inline script prevents the flash of the wrong theme** (FOUC). It is intentionally tiny,
  dependency-free, and mirrors `NO_FLASH_SCRIPT` in `theme.ts`.
- `applyTheme()` also sets `style.colorScheme`, so native widgets (scrollbars, form controls)
  match the theme.
- There is exactly **one** `ThemeProvider` per app. Nesting a second one causes conflicting
  `data-theme` writes and is forbidden.

---

## 3. API

```tsx
import { ThemeProvider, ThemeSwitcher, useTheme } from "@krishima/ui";

// App root
<ThemeProvider>
  <App />
</ThemeProvider>;

// Anywhere inside
const { preference, resolved, setPreference } = useTheme();
// preference: "light" | "dark" | "system"
// resolved:   "light" | "dark"

<ThemeSwitcher />; // ready-made Light/Dark/System control
```

Helpers (also exported): `readStoredPreference`, `writeStoredPreference`, `resolveTheme`,
`systemPrefersDark`, `applyTheme`, `isThemePreference`, `THEME_STORAGE_KEY`, `NO_FLASH_SCRIPT`.

---

## 4. Adding a theme-aware style

1. Add/override the token in `tokens.css` inside the relevant scope.
2. Use the semantic token in the component — **never** branch on the theme in JS for styling.

```css
/* light (default) */
:root { --kr-highlight: #dcfce7; }
/* dark override */
[data-theme="dark"] { --kr-highlight: rgb(134 239 172 / 0.14); }
```

```tsx
<div className="bg-[color:var(--kr-highlight)]">…</div>
```

---

## 5. Verification checklist

| Check | Expected |
|-------|----------|
| Fresh load, no stored preference | `data-theme="light"` |
| Switch to Dark | `data-theme="dark"`, `krishima.theme="dark"` |
| Reload | stays dark, **no flash** |
| Switch to System (OS dark) | `data-theme="dark"` |
| Toggle OS theme while in System | app follows immediately |
| Storage blocked | app still renders (light), no crash |
| Native scrollbars | match theme (`color-scheme`) |

All of the above were executed against the running app; results are in the
[validation report](../testing/DESIGN_SYSTEM_VALIDATION_REPORT.md).

---

## 6. Constraints

- Do not use `prefers-color-scheme` media queries **inside components** — theme resolution happens
  once in the provider. (A `prefers-reduced-motion` query is unrelated and allowed.)
- Do not store the theme anywhere except `krishima.theme`.
- Do not introduce a second theme provider or a competing `dark` class strategy. The project uses
  the `data-theme` attribute selector, not Tailwind's `class` dark mode.
