import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/PageHero";

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHero title="Impressum" />
      <section className="py-16 prose max-w-3xl mx-auto px-4">
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          <strong>RKS Fachkräfte GmbH</strong>
          <br />
          Van-Straße 1
          <br />
          45327 Essen-Katternberg
          <br />
          Deutschland
        </p>
        <p>
          Telefon: +49 1590 6836396
          <br />
          E-Mail: info@rks-fachkraefte.de
        </p>
        <p>
          Vertreten durch die Geschäftsführung:
          <br />
          Chrissi Szymanek und Rahel Szymanek
        </p>
        <p>
          Registergericht: Amtsgericht Essen
          <br />
          Registernummer: HRB 28471
        </p>
        <p>Umsatzsteuer-ID: DE 328 471 609</p>
      </section>
    </>
  );
}
