import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero title="Datenschutzerklärung" />
      <section className="py-16 prose max-w-3xl mx-auto px-4">
        <h2>1. Datenschutz auf einen Blick</h2>
        <p>Die RKS Fachkräfte GmbH nimmt den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>
        <h2>2. Verantwortliche Stelle</h2>
        <p>RKS Fachkräfte GmbH, Van-Straße 1, 45327 Essen-Katternberg, info@rks-fachkraefte.de</p>
        <h2>3. Erhebung und Speicherung personenbezogener Daten</h2>
        <p>Bei der Nutzung unserer Website und insbesondere bei Bewerbungen und Arbeitgeber-Anfragen erheben wir folgende Daten: Name, E-Mail, Telefonnummer, berufliche Qualifikationen und hochgeladene Dokumente.</p>
        <h2>4. Zweck der Datenverarbeitung</h2>
        <p>Die Daten werden ausschließlich zur Durchführung der Fachkräftevermittlung verwendet.</p>
        <h2>5. Ihre Rechte</h2>
        <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten. Kontaktieren Sie uns unter info@rks-fachkraefte.de.</p>
        <h2>6. Cookies</h2>
        <p>Unsere Website verwendet nur technisch notwendige Cookies. Analyse-Cookies werden nur mit Ihrer Einwilligung gesetzt.</p>
      </section>
    </>
  );
}
