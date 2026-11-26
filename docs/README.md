# KRISHIMA Documentation Index

This directory is the authoritative Phase 0 documentation set. Documents are numbered
by category; cross-references use relative paths.

## Read in this order

| # | Document | Purpose |
|---|----------|---------|
| 1 | [product/01-product-requirements.md](product/01-product-requirements.md) | PRD: personas, roles, domains, functional + non-functional requirements, scope per phase |
| 2 | [product/02-account-permission-matrix.md](product/02-account-permission-matrix.md) | RBAC model, roles, permissions, workspace/org access, resource-level rules |
| 3 | [architecture/01-system-design.md](architecture/01-system-design.md) | System design: modules, layers, data flow, scaling, integrations |
| 3b | [architecture/03-auth-and-supabase-setup.md](architecture/03-auth-and-supabase-setup.md) | Supabase & Google auth setup, JWT strategy, DB connection strings, verification matrix |
| 4 | [architecture/02-database-er-diagram.md](architecture/02-database-er-diagram.md) | Conceptual ER diagram + data modelling standards |
| 5 | [standards/01-repository-structure.md](standards/01-repository-structure.md) | Monorepo layout, module boundaries, naming |
| 6 | [standards/02-api-design-standards.md](standards/02-api-design-standards.md) | REST conventions, versioning, errors, pagination, auth headers |
| 7 | [security/01-threat-model.md](security/01-threat-model.md) | Threat model (STRIDE), assets, controls, residual risks |
| 8 | [design/01-design-system-spec.md](design/01-design-system-spec.md) | Brand, color, typography, components, states, accessibility, i18n |
| 9 | [ROADMAP.md](ROADMAP.md) | Phase-by-phase roadmap and deliverables |
| 10 | [DEFINITION-OF-DONE.md](DEFINITION-OF-DONE.md) | Per-task / per-phase completion criteria |
| 11 | [adr/README.md](adr/README.md) | Architecture Decision Records (0001–0009) |
| 12 | [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md) | Unresolved business requirements + proposed assumptions |
| 13 | [testing/README.md](testing/README.md) | Local development, startup commands, migrations, troubleshooting |
| 14 | [testing/FOUNDATION_VALIDATION_REPORT.md](testing/FOUNDATION_VALIDATION_REPORT.md) | Phase 1 foundation validation results |
| 15 | [testing/DESIGN_SYSTEM_VALIDATION_REPORT.md](testing/DESIGN_SYSTEM_VALIDATION_REPORT.md) | Phase 2 design system validation results |

## Design system (Phase 2)

| Document | Purpose |
|----------|---------|
| [design-system/COLOR_SYSTEM.md](design-system/COLOR_SYSTEM.md) | Palette, light/dark tokens, module accents, contrast |
| [design-system/DESIGN_TOKENS.md](design-system/DESIGN_TOKENS.md) | Token architecture, Tailwind mapping, rules |
| [design-system/TYPOGRAPHY.md](design-system/TYPOGRAPHY.md) | Type scale, fonts, multilingual rules |
| [design-system/COMPONENTS.md](design-system/COMPONENTS.md) | Component inventory, states, extension guide |
| [design-system/ACCESSIBILITY.md](design-system/ACCESSIBILITY.md) | WCAG 2.2 AA requirements and checks |
| [design-system/THEME_GUIDE.md](design-system/THEME_GUIDE.md) | Light / Dark / System theme runtime |

## Root entry-point documents

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Project overview, canonical layout, quick start |
| [../ARCHITECTURE.md](../ARCHITECTURE.md) | Architecture entry point + ADR index |
| [../AGENTS.md](../AGENTS.md) | Permanent architecture & working rules (contributors + AI agents) |
| [../SECURITY.md](../SECURITY.md) | Security policy & principles |
| [../CONTRIBUTING.md](../CONTRIBUTING.md) | Contribution workflow & standards |

## Ownership

Each document names an owner role in its header (e.g., *Owner: Security Engineer*).
Owners update their document in the same change that alters the decision it records.

## Conventions

- All documents are written in Markdown, stored in git, and reviewed via pull request.
- **Paths use the canonical root-level layout** (`frontend/ backend/ database/ admin/ mobile/
  packages/ infrastructure/ tests/`) per [ADR-0009](adr/0009-root-level-repository-layout.md).
  Any reference to a superseded `apps/*` path is incorrect.
- Ambiguous requirements are not invented in code — they are logged in
  [OPEN-QUESTIONS.md](OPEN-QUESTIONS.md) with an explicit assumption until resolved.
- Significant technical decisions must have an ADR (see [adr/README.md](adr/README.md)).
