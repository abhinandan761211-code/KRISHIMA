# KRISHIMA — Public Website Specification

- **Version:** 1.0
- **Status:** Implemented and validated (see
  [Validation Report](../testing/PUBLIC_WEBSITE_VALIDATION_REPORT.md))
- **Scope:** the public marketing website only. No authenticated area, no
  marketplace transactions, no dashboards.
- **Companions:** [Public Website Guide](../design-system/PUBLIC_WEBSITE_GUIDE.md) ·
  [Design System Spec](../design/01-design-system-spec.md) · [Roadmap](../ROADMAP.md)

> **Phase naming.** This work is referred to in the task brief as "Phase 3". The
> roadmap's Phase 3 is *Catalog & Listings*, which has **not** started. The public
> website is foundation/marketing work outside the phased business scope. See
> [DEVELOPMENT_PROGRESS.md](../../DEVELOPMENT_PROGRESS.md).

---

## 1. Purpose

Give every participant in Indian agriculture — farmer, buyer, retailer, worker,
equipment owner, transporter, warehouse, creator — one trustworthy place to
understand what KRISHIMA will do, and to reach the right service area.

## 2. Audience and constraints

- Mobile-first; farmers use low-cost Android phones, outdoors, on weak networks.
- Bilingual intent (English + Hindi at launch); Hindi must never be presented as
  translated until it is.
- Trust is the product. Nothing may claim a capability, certification or
  partnership that does not exist.

## 3. Routes

| Path | Page | Indexable |
|------|------|-----------|
| `/` | Landing (15 sections) | yes |
| `/about` | About / principles / status | yes |
| `/services` | Ten service areas with real status | yes |
| `/how-it-works` | Four-step journey | yes |
| `/faq` | Accessible accordion | yes |
| `/contact` | Contact form (send unavailable) | yes |
| `/help` | Using the website | yes |
| `/privacy` | Privacy policy — **draft** | yes |
| `/terms` | Terms of use — **draft** | yes |
| `/solutions/farmer` | Farmer solutions | yes |
| `/solutions/buyer` | Buyer solutions | yes |
| `/solutions/retailer` | Retailer solutions | yes |
| `/solutions/worker` | Worker solutions | yes |
| `/solutions/equipment` | Equipment owner solutions | yes |
| `/solutions/transporter` | Transporter solutions | yes |
| `/solutions/warehouse` | Warehouse solutions | yes |
| `/solutions/creator` | Creator solutions | yes |
| `*` | Not Found | no |

All `/solutions/*` routes are generated from `data/roles.ts`; a role cannot exist
as a card without a page, or as a page without a card.

## 4. Landing page sections (in order)

1. **Announcement bar** — config-driven, dismissible, can be disabled entirely.
2. **Hero** — headline, description, two CTAs, responsive agriculture photograph.
3. **Platform introduction** — what KRISHIMA is; three principles.
4. **Account categories** — eight role cards with icon, title, description, destination.
5. **Platform features** — responsive bento grid of ten areas, each labelled with
   its true status (planned vs available).
6. **Connected ecosystem** — how the eight participants relate (lightweight SVG/CSS).
7. **How it works** — four steps; no implication that unfinished steps work.
8. **Farmer solutions** — six planned capabilities, labelled planned.
9. **Business solutions** — buyers, retailers, transport, equipment, warehouses, partners.
10. **Marketplace preview** — illustrative only; marked as such; no transaction logic.
11. **Community and knowledge** — planned community and video learning.
12. **Trust and security** — implemented vs planned, stated separately; no guarantees.
13. **FAQ** — reusable accessible accordion.
14. **Final CTA** — registration (disabled) and contact.
15. **Footer** — brand, platform, account categories, help/legal, contact.

## 5. Honesty contract (non-negotiable)

| Rule | Implementation |
|------|----------------|
| No invented statistics | No figures appear anywhere in the copy. |
| No invented contact details | `supportEmail`/`supportPhone` are `undefined`; the UI states a channel is not yet published. |
| No claimed government partnership/certification | Explicit disclaimer on the landing page and in legal pages. |
| Legal pages are drafts | `legalReviewStatus: "draft"` renders a draft banner on both pages. |
| Unavailable actions never simulate success | Login/registration render as `aria-disabled` controls; the contact form explicitly says sending is not connected. |
| Planned features are labelled | Every service/feature card carries a status badge. |
| Hindi is not faked | `hi` is registered `partial`; it is not selectable until professionally translated. |

## 6. Design direction

Modern minimal flat UI; bento grid for features; enterprise-SaaS clarity for
business content; editorial layout for marketing prose; restrained agriculture
photography. Explicitly avoided: glassmorphism, neumorphism, neon, heavy
gradients, heavy shadows, gratuitous animation.

Brand: KRISHI `#15803D`, MA black/white by theme, primary `#15803D`, secondary
`#166534`, decorative gold `#D5A13A` (decorative only, never body text).

All colours resolve through `packages/ui/styles/tokens.css`. The website adds
three semantic tokens (see the Guide §5) purely to fix measured contrast failures.

## 7. Typography and layout

- Inter for Latin, Noto Sans Devanagari for Hindi, system fallback thereafter.
- 16px body text for farmer-facing copy; body line length capped near 68ch.
- 8px control radius, 12px card radius (from tokens).
- One responsive container with a public max width and mobile padding.

## 8. Multilingual foundation

- All user-facing strings live in `i18n/en.ts`; `hi.ts` mirrors the key set exactly
  (enforced by a unit test).
- Adding a locale = a new catalogue + a registry entry; no page restructuring.
- A locale is offered only when its registry status is `complete`.

## 9. Accessibility

Target WCAG 2.2 AA. Verified automatically with axe-core on every route, in both
themes (see the validation report for the exact result and the manual items still
outstanding). Information is never conveyed by colour alone; every status badge
carries text.

## 10. Performance

- Route-based code splitting for the dev-only design-system page.
- Responsive `srcSet` images; hero prioritised, below-fold lazy.
- No animation or visualisation library.

Measured bundle: **452.79 kB JS (127.40 kB gzip)**, CSS **50 kB**. Reported honestly
in the validation report — this is a single-chunk marketing bundle, not optimised
further in this phase.

## 11. Out of scope (explicit)

Authentication business logic, role dashboards, marketplace transactions,
payments, social features, AI/ML, and new database migrations. See AGENTS §12.
