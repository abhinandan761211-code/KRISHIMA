import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Button, Container, Input, Textarea, useI18n } from "@krishima/ui";
import { PageIntro } from "@/features/public-website/components/PageIntro";
import { PublicSection } from "@/features/public-website/components/PublicSection";
import { useSeo } from "@/features/public-website/seo/useSeo";
import { PUBLIC_SITE } from "@/features/public-website/data/site-config";
import { PUBLIC_ROLES } from "@/features/public-website/data/roles";

type FormStatus = "idle" | "invalid" | "unavailable" | "offline";

/**
 * /contact
 *
 * There is NO contact endpoint in the backend yet (no notification module ships
 * before the domain phases). The form therefore:
 *  - validates locally and tells the user exactly which field is wrong;
 *  - on submit, states plainly that sending is unavailable and offers the
 *    documented alternative;
 *  - never shows a success message, never clears the fields, never pretends.
 *
 * When an endpoint exists, replace `onSubmit` — the markup and validation stay.
 */
export function ContactPage() {
  const { t } = useI18n();
  useSeo({
    titleKey: "meta.contact.title",
    descriptionKey: "meta.contact.description",
    path: "/contact",
    imagePath: "/images/og-default.jpg",
  });

  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get("role") ?? "");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  useEffect(() => {
    if (typeof navigator !== "undefined" && !navigator.onLine) setStatus("offline");
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = t("contact.errors.name");
    if (message.trim().length < 10) next.message = t("contact.errors.message");
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("invalid");
      return;
    }
    setStatus(typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "unavailable");
  };

  return (
    <>
      <PageIntro
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        description={t("contact.description")}
      />
      <PublicSection>
        <Container size="2xl" className="max-w-[var(--kr-container-public)]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-role"
                  className="text-[length:var(--kr-text-label)] font-medium text-[color:var(--kr-fg-body)]"
                >
                  {t("contact.fields.role")}
                </label>
                <select
                  id="contact-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="min-h-[var(--kr-touch-target)] w-full rounded-[var(--kr-radius-md)] border border-[color:var(--kr-input-border)] bg-[color:var(--kr-input-bg)] px-3 text-[15px] text-[color:var(--kr-input-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-1"
                >
                  <option value="">{t("contact.fields.rolePlaceholder")}</option>
                  {PUBLIC_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {t(`roles.${r.id}.name`)}
                    </option>
                  ))}
                  <option value="other">{t("contact.fields.roleOther")}</option>
                </select>
              </div>

              <Input
                label={t("contact.fields.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                autoComplete="name"
                required
              />
              <Textarea
                label={t("contact.fields.message")}
                hint={t("contact.fields.messageHint")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                error={errors.message}
                rows={5}
                required
              />

              <div className="flex flex-col gap-3">
                <Button type="submit" size="md" className="w-full sm:w-auto sm:self-start">
                  {t("contact.submit")}
                </Button>
                <p className="text-[length:var(--kr-text-caption)] text-[color:var(--kr-fg-muted)]">
                  {t("contact.privacyNote")}
                </p>
              </div>

              {status === "unavailable" && (
                <Alert tone="warning" title={t("contact.unavailableTitle")}>
                  {PUBLIC_SITE.contact.supportEmail ? (
                    <p>
                      {t("contact.unavailableWithEmail")}{" "}
                      <a
                        className="font-semibold underline underline-offset-4"
                        href={`mailto:${PUBLIC_SITE.contact.supportEmail}`}
                      >
                        {PUBLIC_SITE.contact.supportEmail}
                      </a>
                    </p>
                  ) : (
                    <p>{t("contact.unavailableNoEmail")}</p>
                  )}
                </Alert>
              )}
              {status === "offline" && (
                <Alert tone="warning" title={t("contact.offlineTitle")}>
                  {t("contact.offlineBody")}
                </Alert>
              )}
              {status === "invalid" && (
                <p role="alert" className="text-[length:var(--kr-text-sm)] font-medium text-[color:var(--kr-error)]">
                  {t("contact.errors.summary")}
                </p>
              )}
            </form>

            <aside className="flex flex-col gap-4">
              <div className="rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5">
                <h2 className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
                  {t("contact.side.title")}
                </h2>
                <p className="mt-2 text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                  {t("contact.side.body")}
                </p>
              </div>
              <div className="rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface-secondary)] p-5">
                <h2 className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
                  {t("contact.side.helpTitle")}
                </h2>
                <p className="mt-2 text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                  {t("contact.side.helpBody")}
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </PublicSection>
    </>
  );
}
