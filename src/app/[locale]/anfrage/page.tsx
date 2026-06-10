import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { EmployerWizard } from "@/components/forms/EmployerWizard";

export default async function EmployerRequestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RequestContent />;
}

function RequestContent() {
  const t = useTranslations("employerForm");
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16 px-4">
        <EmployerWizard />
      </section>
    </>
  );
}
