import { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  DashboardCard,
  DataTable,
  Dialog,
  Drawer,
  DropdownMenu,
  EmptyState,
  ErrorState,
  Heading,
  IconButton,
  Input,
  KrishimaLogo,
  ListItem,
  MobileBottomNavigation,
  NumericText,
  OfflineState,
  PageHeader,
  Pagination,
  ProgressBar,
  RadioGroup,
  Select,
  Separator,
  Sidebar,
  Skeleton,
  SkeletonText,
  Spinner,
  StatisticCard,
  StatusBadge,
  Switch,
  Tabs,
  Text,
  Textarea,
  ThemeSwitcher,
  Timeline,
  Tooltip,
  useTheme,
  useToast,
  type Column,
  type StatusKind,
} from "@krishima/ui";
import { config } from "@/config/env";
import {
  MODULE_ACCENTS,
  RADIUS_SCALE,
  SEMANTIC_SWATCHES,
  SPACE_SCALE,
  TYPE_SCALE,
} from "../previewData";

/** Reads a CSS custom property from :root so swatches show the REAL token value. */
function useTokenValues(tokens: string[], themeKey: string): Record<string, string> {
  return useMemo(() => {
    if (typeof window === "undefined") return {};
    const cs = getComputedStyle(document.documentElement);
    return Object.fromEntries(tokens.map((t) => [t, cs.getPropertyValue(t).trim()]));
    // Re-read when the resolved theme changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens.join(","), themeKey]);
}

interface DemoRow {
  id: string;
  product: string;
  qty: string;
  price: string;
  status: StatusKind;
}

const DEMO_ROWS: DemoRow[] = [
  { id: "1", product: "Basmati rice (sample)", qty: "12.500 quintal", price: "₹58,750.00", status: "active" },
  { id: "2", product: "Wheat (sample)", qty: "40.000 quintal", price: "₹98,000.00", status: "pending" },
  { id: "3", product: "Mustard oil (sample)", qty: "90.000 litre", price: "₹16,200.00", status: "draft" },
];

export function DesignSystemPage() {
  const { resolved } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (config.VITE_APP_ENV === "production") {
    return (
      <Container className="py-10">
        <KrishimaLogo as="h1" size="lg" />
        <Text className="mt-2">The design system preview is a development-only page.</Text>
      </Container>
    );
  }

  return (
    <main className="pb-20">
      <DevBanner />
      <Container className="py-8">
        <PageHeader
          title="KRISHIMA Design System"
          description="Development preview. All sample content below is illustrative, not real user data."
          actions={<ThemeSwitcher />}
        />

        <BrandSection currentTheme={resolved} />
        <ColorSection currentTheme={resolved} />
        <ModuleAccentSection currentTheme={resolved} />
        <TypographySection />
        <SpacingSection currentTheme={resolved} />
        <ButtonSection onOpenDialog={() => setDialogOpen(true)} onOpenDrawer={() => setDrawerOpen(true)} />
        <FormSection />
        <CardSection />
        <NavigationSection onOpenDrawer={() => setDrawerOpen(true)} />
        <FeedbackSection />
        <StatesSection />
        <DataSection />
        <DashboardSection />
        <AccessibilitySection />
      </Container>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Confirm action"
        description="This is an illustrative dialog from the design system preview."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
          </>
        }
      >
        <Text size="sm">Dialogs trap focus, close on Escape, and restore focus to the trigger.</Text>
      </Dialog>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters">
        <Text size="sm">Illustrative side panel. Use for mobile filters and details.</Text>
      </Drawer>

      <DemoBottomNav />
    </main>
  );
}

function DevBanner() {
  return (
    <div className="bg-[color:var(--kr-warning-bg)] px-4 py-2 text-center text-sm font-medium text-[color:var(--kr-warning)]">
      Development preview — sample data is illustrative and not real.
    </div>
  );
}

function SectionBlock({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-border py-8 first:border-t-0">
      <Heading level={2} id={id} className="mb-1">
        {title}
      </Heading>
      {description && <Text size="sm" className="mb-4">{description}</Text>}
      <div className={description ? "" : "mt-4"}>{children}</div>
    </section>
  );
}

function BrandSection({ currentTheme }: { currentTheme: string }) {
  return (
    <SectionBlock
      id="brand"
      title="Brand identity"
      description="The wordmark is fixed: KRISHI is always brand green; MA follows the theme (black on light, white on dark)."
    >
      <div className="flex flex-wrap items-center gap-8">
        <div className="rounded-card border border-border bg-surface p-6">
          <KrishimaLogo size="lg" />
          <Text size="caption" className="mt-2">Large — light surface</Text>
        </div>
        <div
          data-theme="dark"
          className="rounded-card border border-border bg-bg p-6"
        >
          <KrishimaLogo size="lg" />
          <Text size="caption" className="mt-2">Large — dark surface (forced)</Text>
        </div>
        <div className="rounded-card bg-[color:var(--kr-footer-bg)] p-6">
          <KrishimaLogo size="md" variant="inverse" />
          <Text size="caption" className="mt-2 !text-white/80">On footer</Text>
        </div>
      </div>
      <p className="sr-only">Current resolved theme: {currentTheme}</p>
    </SectionBlock>
  );
}

function ColorSection({ currentTheme }: { currentTheme: string }) {
  const values = useTokenValues(SEMANTIC_SWATCHES.map((s) => s.token), currentTheme);
  return (
    <SectionBlock id="colors" title="Semantic colours" description="Values read live from CSS custom properties for the active theme.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SEMANTIC_SWATCHES.map((s) => (
          <div key={s.token} className="overflow-hidden rounded-md border border-border">
            <div className="h-14 w-full border-b border-border" style={{ background: `var(${s.token})` }} />
            <div className="bg-surface p-2">
              <p className="text-xs font-medium text-fg">{s.label}</p>
              <code className="block truncate text-[11px] text-fg-placeholder">{s.token}</code>
              <code className="block truncate text-[11px] text-fg-placeholder">{values[s.token] || "—"}</code>
            </div>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

function ModuleAccentSection({ currentTheme }: { currentTheme: string }) {
  const values = useTokenValues(MODULE_ACCENTS.map((s) => s.token), currentTheme);
  return (
    <SectionBlock
      id="modules"
      title="Module accents"
      description="Accents are for icons, small labels and category chips only — never primary buttons or navigation."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {MODULE_ACCENTS.map((m) => (
          <div key={m.token} className="flex items-center gap-2 rounded-md border border-border bg-surface p-2">
            <span
              aria-hidden="true"
              className="h-6 w-6 shrink-0 rounded-full"
              style={{ background: `var(${m.token})` }}
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium" style={{ color: `var(${m.token})` }}>
                {m.label}
              </p>
              <code className="block truncate text-[10px] text-fg-placeholder">{values[m.token]}</code>
            </div>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

function TypographySection() {
  return (
    <SectionBlock id="type" title="Typography" description="Inter for English; Noto Sans Devanagari for Hindi. Body text is 16px minimum.">
      <Card>
        <div className="space-y-3">
          {TYPE_SCALE.map((t) => (
            <div key={t.token} className="flex items-baseline gap-4">
              <code className="w-40 shrink-0 text-[11px] text-fg-placeholder">{t.label}</code>
              <span
                className="text-fg"
                style={{
                  fontSize: `var(${t.token})`,
                  fontWeight: t.level ? 600 : 400,
                  lineHeight: 1.3,
                }}
              >
                KRISHIMA agriculture
              </span>
            </div>
          ))}
          <Separator />
          <div className="flex items-baseline gap-4">
            <code className="w-40 shrink-0 text-[11px] text-fg-placeholder">Hindi</code>
            <span lang="hi" className="text-fg" style={{ fontSize: "var(--kr-text-body)" }}>
              कृषि सेवाएँ — किसान, खरीदार और मज़दूर
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <code className="w-40 shrink-0 text-[11px] text-fg-placeholder">Numeric</code>
            <NumericText emphasis>₹1,24,500.00</NumericText>
          </div>
        </div>
      </Card>
    </SectionBlock>
  );
}

function SpacingSection({ currentTheme }: { currentTheme: string }) {
  const values = useTokenValues([...SPACE_SCALE, ...RADIUS_SCALE], currentTheme);
  return (
    <SectionBlock id="spacing" title="Spacing & radius" description="4px-based spacing scale and the approved radius system.">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Heading level={3} className="mb-3">Spacing</Heading>
          <div className="space-y-2">
            {SPACE_SCALE.map((s) => (
              <div key={s} className="flex items-center gap-3">
                <code className="w-24 shrink-0 text-[11px] text-fg-placeholder">{s.replace("--kr-", "")}</code>
                <div className="h-3 rounded-sm bg-primary" style={{ width: `var(${s})` }} />
                <code className="text-[11px] text-fg-placeholder">{values[s]}</code>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <Heading level={3} className="mb-3">Radius</Heading>
          <div className="flex flex-wrap items-end gap-4">
            {RADIUS_SCALE.map((r) => (
              <div key={r} className="text-center">
                <div
                  className="h-16 w-16 border border-border-strong bg-surface-muted"
                  style={{ borderRadius: `var(${r})` }}
                />
                <code className="mt-1 block text-[11px] text-fg-placeholder">{r.replace("--kr-radius-", "")}</code>
                <code className="block text-[11px] text-fg-placeholder">{values[r]}</code>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SectionBlock>
  );
}

function ButtonSection({ onOpenDialog, onOpenDrawer }: { onOpenDialog: () => void; onOpenDrawer: () => void }) {
  const toast = useToast();
  return (
    <SectionBlock id="buttons" title="Buttons & interaction states" description="Hover, focus-visible, active, disabled and loading are all styled; never colour-only.">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <Heading level={3} className="mb-3">Variants</Heading>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
          </div>
          <Heading level={3} className="mb-3 mt-6">Sizes</Heading>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <IconButton aria-label="Add item" icon="＋" />
          </div>
        </Card>
        <Card>
          <Heading level={3} className="mb-3">States</Heading>
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Disabled</Button>
            <Button loading>Loading…</Button>
            <Tooltip content="Tooltips appear on hover and focus">
              <Button variant="secondary">With tooltip</Button>
            </Tooltip>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onOpenDialog}>Open dialog</Button>
            <Button variant="secondary" onClick={onOpenDrawer}>Open drawer</Button>
            <Button
              variant="secondary"
              onClick={() => toast.show({ tone: "success", title: "Saved", description: "Illustrative toast." })}
            >
              Show toast
            </Button>
          </div>
        </Card>
      </div>
    </SectionBlock>
  );
}

function FormSection() {
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("farmer");
  const [sw, setSw] = useState(false);
  return (
    <SectionBlock id="forms" title="Form elements" description="Labels, hints and errors are associated programmatically (aria-describedby).">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="space-y-4">
            <Input label="Full name" placeholder="Ramesh Kumar" required />
            <Input label="Mobile number" placeholder="98765 43210" hint="We use this for delivery updates." />
            <Input label="Price" placeholder="0.00" error="Enter a price greater than zero." />
            <Input label="Read-only" value="KR-ORD-2026-000123" readOnly />
            <Input label="Disabled" value="Not editable" disabled />
            <Textarea label="Notes" placeholder="Add instructions for the driver…" />
            <Select
              label="Unit"
              options={[
                { value: "kg", label: "Kilogram" },
                { value: "quintal", label: "Quintal" },
                { value: "tonne", label: "Tonne" },
              ]}
            />
          </div>
        </Card>
        <Card>
          <div className="space-y-5">
            <Checkbox
              label="I agree to the terms"
              description="Illustrative checkbox with a 44px touch target."
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <RadioGroup
              label="Account type"
              name="demo-role"
              value={radio}
              onChange={setRadio}
              options={[
                { value: "farmer", label: "Farmer", description: "Sell produce and buy inputs" },
                { value: "buyer", label: "Buyer", description: "Source produce" },
              ]}
            />
            <Separator />
            <Switch checked={sw} onChange={setSw} label="SMS notifications" description="Illustrative toggle." />
            <Input label="Error state" error="This field is required." />
          </div>
        </Card>
      </div>
    </SectionBlock>
  );
}

function CardSection() {
  return (
    <SectionBlock id="cards" title="Cards" description="Surface, bordered containers with consistent padding and radius.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <Heading level={3}>Standard card</Heading>
          <Text size="sm" className="mt-2">Body content sits on the surface token.</Text>
        </Card>
        <Card elevation="raised">
          <Heading level={3}>Raised card</Heading>
          <Text size="sm" className="mt-2">Subtle shadow for emphasis.</Text>
        </Card>
        <Card padding="none" className="overflow-hidden">
          <div className="h-24 bg-[color:var(--kr-surface-muted)]" />
          <div className="p-4">
            <Heading level={3}>Media card</Heading>
            <Text size="sm" className="mt-1">Image area + content.</Text>
          </div>
        </Card>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Badge>Neutral</Badge>
        <Badge tone="primary">Primary</Badge>
        <Badge tone="success" icon={<span>✓</span>}>Success</Badge>
        <Badge tone="warning" icon={<span>!</span>}>Warning</Badge>
        <Badge tone="error" icon={<span>✕</span>}>Error</Badge>
        <Badge tone="info" icon={<span>ℹ</span>}>Info</Badge>
      </div>
    </SectionBlock>
  );
}

function NavigationSection({ onOpenDrawer }: { onOpenDrawer: () => void }) {
  const [tab, setTab] = useState("overview");
  const [page, setPage] = useState(2);
  return (
    <SectionBlock id="navigation" title="Navigation" description="Sidebar is desktop-only; bottom navigation is mobile-only. Native elements where practical.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card padding="none" className="flex min-h-[280px] overflow-hidden">
          <Sidebar
            label="Example sidebar"
            items={[
              { key: "home", label: "Dashboard", href: "#", current: true, icon: "▦" },
              { key: "listings", label: "My listings", href: "#", icon: "≡" },
              { key: "orders", label: "Orders", href: "#", icon: "⇄" },
              { key: "reports", label: "Reports", href: "#", icon: "◔" },
            ]}
            footer={<Text size="caption">Sample sidebar</Text>}
          />
          <div className="flex-1 p-4">
            <Text size="sm">Sidebar content area (visible ≥ 768px).</Text>
            <div className="mt-4">
              <Tabs
                label="Example tabs"
                activeKey={tab}
                onChange={setTab}
                items={[
                  { key: "overview", label: "Overview" },
                  { key: "details", label: "Details" },
                  { key: "history", label: "History" },
                ]}
              />
              <div role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-3">
                <Text size="sm">Active tab: {tab}</Text>
              </div>
            </div>
            <div className="mt-6">
              <Pagination page={page} totalPages={8} onPageChange={setPage} />
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <Heading level={3} className="mb-2">Breadcrumb</Heading>
            <nav aria-label="Example breadcrumb" className="flex items-center gap-2 text-sm text-fg-muted">
              <a href="#" className="inline-flex min-h-[var(--kr-touch-target)] items-center hover:underline">Home</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="font-medium text-fg-body">Listings</span>
            </nav>
            <div className="mt-4">
              <DropdownMenu
                label="Example menu"
                trigger={
                  <>
                    Menu <span aria-hidden="true">▾</span>
                  </>
                }
                items={[
                  { key: "edit", label: "Edit", onSelect: () => { } },
                  { key: "dup", label: "Duplicate", onSelect: () => { } },
                  { key: "del", label: "Delete", onSelect: () => { }, danger: true },
                ]}
              />
            </div>
            <div className="mt-4">
              <Button variant="secondary" size="sm" onClick={onOpenDrawer}>
                Open mobile drawer
              </Button>
            </div>
          </Card>
          <Card>
            <Heading level={3} className="mb-2">Mobile bottom navigation</Heading>
            <div className="relative mx-auto h-20 w-[280px] overflow-hidden rounded-card border border-border bg-surface">
              <MobileBottomNavigation
                items={[
                  { key: "home", label: "Home", href: "#", current: true, icon: "⌂" },
                  { key: "market", label: "Market", href: "#", icon: "▤" },
                  { key: "orders", label: "Orders", href: "#", icon: "⇄" },
                  { key: "account", label: "Account", href: "#", icon: "☺" },
                ]}
              />
            </div>
          </Card>
        </div>
      </div>
    </SectionBlock>
  );
}

function FeedbackSection() {
  return (
    <SectionBlock id="feedback" title="Alerts & feedback" description="Each tone pairs an icon and a text label with colour.">
      <div className="grid gap-3">
        <Alert tone="info" title="Information">Informational message.</Alert>
        <Alert tone="success" title="Success">Your listing was published.</Alert>
        <Alert tone="warning" title="Warning">Your KYC verification is pending.</Alert>
        <Alert tone="error" title="Error">We could not save your changes. Please retry.</Alert>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card>
          <Heading level={3} className="mb-3">Loading</Heading>
          <div className="flex items-center gap-4">
            <Spinner />
            <Spinner size="sm" />
            <Spinner size="lg" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="w-2/3" />
            <SkeletonText lines={3} />
          </div>
          <div className="mt-4">
            <ProgressBar value={62} label="Upload progress" />
          </div>
        </Card>
        <Card>
          <Heading level={3} className="mb-3">Status badges</Heading>
          <div className="flex flex-wrap gap-2">
            {(["active", "pending", "verified", "rejected", "connected", "configured", "not_configured", "failed", "draft", "completed"] as StatusKind[]).map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </div>
        </Card>
      </div>
    </SectionBlock>
  );
}

function StatesSection() {
  return (
    <SectionBlock id="states" title="Empty, error & offline states" description="Every data view must handle these; none may be a dead end.">
      <div className="grid gap-4 md:grid-cols-3">
        <Card padding="none">
          <EmptyState
            title="No listings yet"
            description="Create your first listing to start selling produce."
            action={<Button size="sm">Add listing</Button>}
          />
        </Card>
        <Card padding="none">
          <ErrorState description="We could not load your orders." onRetry={() => { }} reference="req-demo-123" />
        </Card>
        <Card padding="none">
          <OfflineState onRetry={() => { }} />
        </Card>
      </div>
    </SectionBlock>
  );
}

function DataSection() {
  const [page, setPage] = useState(1);
  const columns: Column<DemoRow>[] = [
    { key: "product", header: "Product", cell: (r) => r.product },
    { key: "qty", header: "Quantity", numeric: true, hideBelow: "md", cell: (r) => r.qty },
    { key: "price", header: "Amount", numeric: true, cell: (r) => <NumericText>{r.price}</NumericText> },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];
  return (
    <SectionBlock id="data" title="Data display" description="Real table semantics and a caption; secondary columns hide on small screens instead of overflowing.">
      <DataTable caption="Sample orders (illustrative)" columns={columns} rows={DEMO_ROWS} rowKey={(r) => r.id} />
      <div className="mt-3 flex justify-end">
        <Pagination page={page} totalPages={5} onPageChange={setPage} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <Heading level={3} className="mb-3">List items</Heading>
          <div className="-mx-6 divide-y divide-border">
            <ListItem leading={<span aria-hidden="true">🌾</span>} title="Basmati rice" description="12.5 quintal · Nashik" trailing={<StatusBadge status="active" />} />
            <ListItem leading={<span aria-hidden="true">🌾</span>} title="Wheat" description="40 quintal · Indore" trailing={<StatusBadge status="pending" />} />
          </div>
        </Card>
        <Card>
          <Heading level={3} className="mb-3">Timeline</Heading>
          <Timeline
            label="Order history (illustrative)"
            items={[
              { key: "1", title: "Order placed", timestamp: "10:02", tone: "success" },
              { key: "2", title: "Payment received", timestamp: "10:05", tone: "success" },
              { key: "3", title: "Awaiting dispatch", timestamp: "10:20", tone: "warning" },
            ]}
          />
        </Card>
      </div>
    </SectionBlock>
  );
}

function DashboardSection() {
  return (
    <SectionBlock id="dashboard" title="Dashboard examples" description="Composed from tokens + shared cards. Illustrative numbers only.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard label="Active listings" value="12" delta={{ value: "+2 this week", direction: "up" }} />
        <StatisticCard label="Open orders" value="5" delta={{ value: "No change", direction: "flat" }} />
        <StatisticCard label="Revenue (month)" value="₹1,24,500" delta={{ value: "-4%", direction: "down" }} />
        <StatisticCard label="Pending payouts" value="₹18,200" />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Farm overview"
          icon="🌱"
          accentVar="var(--kr-mod-farmer)"
          footer={<Button size="sm" variant="link">View farms</Button>}
        >
          Track crops, acreage and harvest schedules.
        </DashboardCard>
        <DashboardCard
          title="Orders to fulfil"
          icon="📦"
          accentVar="var(--kr-mod-buyer)"
          footer={<Button size="sm" variant="link">Open orders</Button>}
        >
          3 orders awaiting dispatch today.
        </DashboardCard>
        <DashboardCard
          title="Verification"
          icon="🛡"
          accentVar="var(--kr-mod-admin)"
          footer={<Button size="sm" variant="link">Complete KYC</Button>}
        >
          Your KYC is pending review.
        </DashboardCard>
      </div>
    </SectionBlock>
  );
}

function AccessibilitySection() {
  return (
    <SectionBlock id="a11y" title="Accessibility guidance" description="Target WCAG 2.2 AA. Automated checks are necessary but not sufficient.">
      <Card>
        <ul className="list-disc space-y-2 pl-5 text-sm text-fg-body">
          <li>Text contrast ≥ 4.5:1; large text ≥ 3:1; UI boundaries ≥ 3:1.</li>
          <li>Never convey status with colour alone — pair with icon and text.</li>
          <li>All interactive elements have a visible focus ring (keyboard operability).</li>
          <li>Icon-only buttons require an <code>aria-label</code>.</li>
          <li>Forms associate labels, hints and errors via <code>aria-describedby</code>.</li>
          <li>Respect <code>prefers-reduced-motion</code>; animations are opt-in.</li>
          <li>Use one <code>h1</code> per page and keep heading order sequential.</li>
          <li>Touch targets are at least 44×44 CSS px.</li>
        </ul>
      </Card>
    </SectionBlock>
  );
}

function DemoBottomNav() {
  return (
    <MobileBottomNavigation
      items={[
        { key: "ds", label: "Design", href: "#brand", current: true, icon: "◈" },
        { key: "colors", label: "Colour", href: "#colors", icon: "◐" },
        { key: "forms", label: "Forms", href: "#forms", icon: "▭" },
        { key: "data", label: "Data", href: "#data", icon: "▤" },
      ]}
    />
  );
}
