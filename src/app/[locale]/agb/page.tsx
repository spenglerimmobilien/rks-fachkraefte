import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero title="Allgemeine Geschäftsbedingungen" />
      <section className="py-16 prose max-w-3xl mx-auto px-4">
        <h2>§ 1 Geltungsbereich</h2>
        <p>Diese AGB gelten für alle Verträge zwischen der RKS Fachkräfte GmbH und ihren Vertragspartnern (Kandidaten und Arbeitgeber).</p>
        <h2>§ 2 Leistungen</h2>
        <p>RKS Fachkräfte vermittelt qualifizierte Fachkräfte aus Marokko an Arbeitgeber in Deutschland. Die Vermittlung für Kandidaten ist kostenfrei.</p>
        <h2>§ 3 Pflichten der Kandidaten</h2>
        <p>Kandidaten verpflichten sich, wahrheitsgemäße Angaben zu machen und erforderliche Dokumente bereitzustellen.</p>
        <h2>§ 4 Pflichten der Arbeitgeber</h2>
        <p>Arbeitgeber verpflichten sich, die vereinbarten Konditionen einzuhalten und mit den vermittelten Fachkräften fair umzugehen.</p>
        <h2>§ 5 Haftung</h2>
        <p>Die Haftung von RKS Fachkräfte ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.</p>
        <h2>§ 6 Schlussbestimmungen</h2>
        <p>Es gilt deutsches Recht. Gerichtsstand ist Essen.</p>
      </section>
    </>
  );
}
