/**
 * @krishima/ui — KRISHIMA design system.
 *
 * Import the token stylesheet once at the app entry:
 *   import "@krishima/ui/styles/tokens.css";   // or the copied src/styles/tokens.css
 *
 * Every visual value must come from tokens.css. Components here are the only
 * approved primitives — do not re-implement them per feature.
 */
export * from "./theme/theme";
export { ThemeProvider, useTheme } from "./theme/ThemeProvider";
export { cn } from "./lib/cn";

export { KrishimaLogo } from "./components/brand/KrishimaLogo";
export { ThemeSwitcher } from "./components/theme/ThemeSwitcher";
export { LanguageSwitcher } from "./components/i18n/LanguageSwitcher";

export {
  initI18n,
  translate,
  translatePlural,
  setLocale,
  getActiveLocale,
  availableLocales,
  subscribeToLocale,
  missingKeys,
  catalogKeys,
  resolveInitialLocale,
  LOCALE_REGISTRY,
  LOCALE_STORAGE_KEY,
  DEFAULT_LOCALE,
} from "./i18n/i18n";
export { I18nProvider, useI18n } from "./i18n/I18nProvider";
export type {
  LocaleCode,
  LocaleDefinition,
  Messages,
  MessageCatalog,
  TranslateValues,
  I18nOptions,
} from "./i18n/i18n";
export type { I18nContextValue } from "./i18n/I18nProvider";

export { Button } from "./components/button/Button";
export { LinkButton } from "./components/button/LinkButton";
export { IconButton } from "./components/button/IconButton";

export { Input } from "./components/form/Input";
export { Textarea } from "./components/form/Textarea";
export { Select } from "./components/form/Select";
export { Checkbox } from "./components/form/Checkbox";
export { RadioGroup } from "./components/form/RadioGroup";
export { Switch } from "./components/form/Switch";
export { Label } from "./components/form/Label";

export { Badge } from "./components/display/Badge";
export { Icon } from "./components/display/Icon";
export type { IconName, IconProps } from "./components/display/Icon";
export { Avatar } from "./components/display/Avatar";
export { Separator } from "./components/display/Separator";

export { Card, CardHeader, CardTitle, CardBody, CardFooter } from "./components/containers/Card";
export { Container, Section } from "./components/containers/Container";
export { PageHeader } from "./components/containers/PageHeader";
export { DashboardCard, StatisticCard } from "./components/containers/DashboardCard";

export { Navbar } from "./components/navigation/Navbar";
export { Sidebar } from "./components/navigation/Sidebar";
export { MobileBottomNavigation } from "./components/navigation/MobileBottomNavigation";
export { Breadcrumb } from "./components/navigation/Breadcrumb";
export { Tabs } from "./components/navigation/Tabs";
export { DropdownMenu } from "./components/navigation/DropdownMenu";
export { Accordion } from "./components/navigation/Accordion";
export { Pagination } from "./components/navigation/Pagination";
export { AccountSwitcher } from "./components/navigation/AccountSwitcher";

export { Alert } from "./components/feedback/Alert";
export { ToastProvider, useToast } from "./components/feedback/Toast";
export { Dialog } from "./components/feedback/Dialog";
export { Drawer } from "./components/feedback/Drawer";
export { Tooltip } from "./components/feedback/Tooltip";
export { Skeleton, SkeletonText } from "./components/feedback/Skeleton";
export { Spinner } from "./components/feedback/Spinner";
export { ProgressBar } from "./components/feedback/ProgressBar";
export { EmptyState, ErrorState, OfflineState } from "./components/feedback/States";

export { DataTable } from "./components/data/DataTable";
export { StatusBadge } from "./components/data/StatusBadge";
export { Timeline } from "./components/data/Timeline";
export { ListItem } from "./components/data/ListItem";
export { ChartContainer } from "./components/data/ChartContainer";

export { Heading, Text, NumericText } from "./components/typography/Text";

export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/button/Button";
export type { LinkButtonProps } from "./components/button/LinkButton";
export type { AccordionItem, AccordionProps } from "./components/navigation/Accordion";
export type { NavItem } from "./components/navigation/Navbar";
export type { Column } from "./components/data/DataTable";
export type { StatusKind } from "./components/data/StatusBadge";
export type { ThemePreference, ResolvedTheme } from "./theme/theme";
