import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";
import { ApplicationWizard } from "@/components/forms/ApplicationWizard";

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ApplicationContent />;
}

function ApplicationContent() {
  const t = useTranslations("apply");
  return (
    <>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16 px-4">
        <ApplicationWizard />
      </section>
    </>
  );
}
